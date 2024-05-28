import { isUndefined } from 'lodash-es';
import { createFileApi, type FileApi } from './fileApi';

/**
 * Удалить файл или папку
 */
export type RemoveEntry = (name: string) => Promise<void>;

/**
 * Прочесть содержимое папки
 */
export type ReadFolder = () => Promise<
  ReadonlyMap<string, FolderApi | FileApi>
>;

/**
 * Добавить папку в папку
 */
export type AddFolderToFolder = (
  name: string,
  type: 'folder',
) => Promise<FolderApi>;

/**
 * Добавить файл в папку
 */
export type AddFileToFolder = (
  name: string,
  type: 'file',
  data?: File | FileSystemWriteChunkType,
) => Promise<FileApi>;

/**
 * Добавить в папку файл или новую папку
 */
export interface AddToFolder {
  (name: string, type: 'folder'): Promise<FolderApi>;
  (
    name: string,
    type: 'file',
    data: File | FileSystemWriteChunkType,
  ): Promise<FileApi>;
}

/**
 * Поиск по названию
 */
type FindEntry = (name: string) => Promise<FolderApi | FileApi | undefined>;

/**
 * Путь по папкам
 */
export type Path = string[];

/**
 * Получить по пути;
 */
type ReadPath = (path: Path) => Promise<FolderApi | FileApi | undefined>;

export interface FolderApi {
  read: ReadFolder;
  add: AddToFolder;
  remove: RemoveEntry;
  find: FindEntry;
  readPath: ReadPath;
}

export const createFolderApi = (
  directoryHandle: FileSystemDirectoryHandle,
): FolderApi => {
  const readFolder: ReadFolder = async (): Promise<
    ReadonlyMap<string, FolderApi | FileApi>
  > => {
    const map = new Map<string, FileApi | FolderApi>();

    for await (const [name, handle] of directoryHandle.entries()) {
      if ('kind' in handle) {
        switch (handle.kind) {
          case 'directory': {
            map.set(name, createFolderApi(handle));
            break;
          }
          case 'file': {
            map.set(name, createFileApi(handle));
            break;
          }
        }
      }
    }

    return map;
  };

  const addFile = async (
    name: string,
    data?: File | FileSystemWriteChunkType,
  ) => {
    const fileHandle = await directoryHandle.getFileHandle(name, {
      create: true,
    });

    const fileApi = createFileApi(fileHandle);

    if (data) {
      await fileApi.write(data);
    }

    return fileApi;
  };

  const addFolder = async (name: string) => {
    const handle = await directoryHandle.getDirectoryHandle(name, {
      create: true,
    });

    return createFolderApi(handle);
  };

  async function add(name: string, type: 'folder'): Promise<FolderApi>;
  async function add(
    name: string,
    type: 'file',
    data: File | FileSystemWriteChunkType,
  ): Promise<FileApi>;
  async function add(
    name: string,
    type: 'file' | 'folder',
    data?: File | FileSystemWriteChunkType,
  ): Promise<FolderApi | FileApi> {
    switch (type) {
      case 'file': {
        return addFile(name, data);
      }
      case 'folder': {
        return addFolder(name);
      }
    }
  }

  const remove: RemoveEntry = async (name: string) => {
    await directoryHandle.removeEntry(name);
  };

  const find: FindEntry = async (name: string) => {
    const list = await readFolder();
    let foundEntry = list.get(name);

    if (!isUndefined(foundEntry)) {
      return foundEntry;
    }

    for (const [entryName, entry] of list) {
      if (!isUndefined(foundEntry)) {
        if (entryName === name) {
          return (foundEntry = entry);
        } else if ('find' in entry) {
          return (foundEntry = await entry.find(name));
        }
      }
    }

    return foundEntry;
  };

  const readPath: ReadPath = async (path: Path) => {
    if (!path.length) {
      return folderApi;
    } else {
      const entity = (await readFolder()).get(path[0]);
      const subPath = path.concat();
      subPath.shift();

      if (!subPath.length) {
        return entity;
      }

      if (entity && 'readPath' in entity) {
        return await entity.readPath(subPath);
      }
    }
    return undefined;
  };

  const folderApi = {
    read: readFolder,
    add,
    remove,
    find,
    readPath,
  };

  return folderApi;
};
