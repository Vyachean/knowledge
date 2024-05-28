import { isFunction } from 'lodash-es';
import { createFolderApi, type FolderApi } from './folderApi';

export interface FileSystemApi {
  folder: FolderApi;
}

export const createFileSystemApi = async (
  id?: string,
  startIn: WellKnownDirectory = 'documents',
): Promise<FileSystemApi> => {
  const getRootHandler = async (): Promise<FileSystemDirectoryHandle> => {
    const showDirectoryPicker = globalThis.showDirectoryPicker;

    if (!isFunction(showDirectoryPicker)) {
      throw new Error(
        'Браузер не поддерживает выбор директории для хранения файлов',
      );
    }

    const selectedFileSystemDirectoryHandle = await showDirectoryPicker({
      id,
      mode: 'readwrite',
      startIn,
    });

    return selectedFileSystemDirectoryHandle;
  };

  const rootFolder = createFolderApi(await getRootHandler());

  return {
    folder: rootFolder,
  };
};
