import type { ReadonlyDeep } from 'type-fest';
import type { Path } from './folderApi';

/**
 * Записать файл
 */
export type WriteFile = (
  data: File | FileSystemWriteChunkType,
) => Promise<File>;

/**
 * Прочесть файл
 */
export type ReadFile = () => Promise<File>;

export interface FileApi {
  read: ReadFile;
  write: WriteFile;
  readonly path: ReadonlyDeep<Path>;
}

export const createFileApi = (
  fileHandle: FileSystemFileHandle,
  path: Path,
): FileApi => {
  const read: ReadFile = async () => {
    return await fileHandle.getFile();
  };

  const write: WriteFile = async (file: File | FileSystemWriteChunkType) => {
    const writableHandle = await fileHandle.createWritable();

    const data: FileSystemWriteChunkType =
      file instanceof File ? await file.arrayBuffer() : file;

    await writableHandle.write(data);

    await writableHandle.close();

    const writtenFile = await fileHandle.getFile();

    return writtenFile;
  };

  const fileApi: FileApi = {
    read,
    write,
    path,
  };

  return fileApi;
};
