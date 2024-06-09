import { defineStore } from 'pinia';
import type { FileApi, FolderApi, Path } from '../../shared/lib/fileSystemApi';
import { createFileSystemApi } from '../../shared/lib/fileSystemApi';
import { computed, reactive, shallowRef } from 'vue';
import type { KeyString } from '../../shared/lib/convertKey';
import { toKey } from '../../shared/lib/convertKey';
import { isEqual, isUndefined } from 'lodash-es';
import { createAsyncInterval } from '../../shared/lib/asyncInterval';

export interface Item {
  name: string;
  type: ItemType;
}

export interface ItemFolder extends Item {
  type: 'folder';
  list: Item[];
}

export interface ItemFile extends Item {
  type: 'file';
  file: File;
}

export type ItemType = 'file' | 'folder';

export type FolderItem = {
  name: string;
  type: ItemType;
};
export type FolderState = FolderItem[];

export const useDirectoryEntity = defineStore('directoryEntity', () => {
  const rootDirectory = shallowRef<FolderApi>();

  const stateItems: Map<KeyString<Path>, ItemFolder | ItemFile> = reactive(
    new Map(),
  );

  /**
   * Выбрать директорию с файлами
   */
  const selectRootDirectory = async () => {
    rootDirectory.value = (await createFileSystemApi('folder-entity')).folder;
  };

  const createItemFolder = async (
    name: string,
    api: FolderApi,
  ): Promise<ItemFolder> => {
    const list: Item[] = [];

    const map = await api.read();

    map.forEach((apiItem, name) => {
      list.push({
        name,
        type: 'add' in apiItem ? 'folder' : 'file',
      });
    });

    return {
      type: 'folder',
      name,
      list,
    };
  };

  const createItemFile = async (
    name: string,
    api: FileApi,
  ): Promise<ItemFile> => {
    const file = await api.read();

    return {
      type: 'file',
      name,
      file,
    };
  };

  /**
   * Чтение элемента по пути
   * @param path
   */
  const readItem = async (path: Path) => {
    const entity = await rootDirectory.value?.readPath(path);
    const key = toKey(path);

    const name = path.at(-1) ?? 'root';

    if (entity && 'add' in entity) {
      const itemFolder = await createItemFolder(name, entity);
      if (!isEqual(itemFolder, stateItems.get(key))) {
        stateItems.set(key, itemFolder);
      }
      return itemFolder;
    }
    if (entity && 'write' in entity) {
      const itemFolder = await createItemFile(name, entity);
      if (!isEqual(itemFolder, stateItems.get(key))) {
        stateItems.set(key, itemFolder);
      }
      return itemFolder;
    }
    stateItems.delete(key);
    return undefined;
  };

  /**
   * Обновить содержимое папки
   */
  const fetchItem = (path: Path) => readItem(path);

  /**
   * Интервальное отслеживание состояния папки
   * @param path - путь к папке
   * @returns
   */
  const watchItem = async (path: Path, intervalTimeout: number = 3e3) => {
    const stopInterval = await createAsyncInterval(
      () => readItem(path),
      intervalTimeout,
    );
    return stopInterval;
  };

  /**
   * Получить содержимое пути
   * @param path - путь к папке
   */
  const getItem = (path: Path) => stateItems.get(toKey(path));

  const selectedRootDirectory = computed(() => !!rootDirectory.value);

  const writeItem = async (path: Path, file?: File) => {
    if (file) {
      await rootDirectory.value?.addPath(path, 'file', file);
    } else {
      await rootDirectory.value?.addPath(path, 'folder');
    }
    const parentPath = path.slice(0, -1);
    if (stateItems.has(toKey(parentPath))) {
      await readItem(parentPath);
    }
    if (stateItems.has(toKey(path))) {
      await readItem(path);
    }
  };

  const deleteItem = async (path: Path) => {
    const parentPath = path.slice(0, -1);
    const name = path.at(-1);
    const entity = await rootDirectory.value?.readPath(parentPath);
    if (entity && 'remove' in entity && !isUndefined(name)) {
      await entity.remove(name);
      if (stateItems.has(toKey(parentPath))) {
        await readItem(parentPath);
      }
    }
  };

  return {
    selectRootDirectory,
    selectedRootDirectory,
    getItem,
    fetchItem,
    watchItem,
    writeItem,
    deleteItem,
  };
});
