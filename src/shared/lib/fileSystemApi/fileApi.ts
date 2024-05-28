/**
 * Записать файл
 */
export type WriteFile = (
  data: File | FileSystemWriteChunkType,
) => Promise<void>;

/**
 * Прочесть файл
 */
export type ReadFile = () => Promise<File>;

export interface FileApi {
  read: ReadFile;
  write: WriteFile;
}

export const createFileApi = (fileHandle: FileSystemFileHandle): FileApi => {
  const read: ReadFile = async () => {
    return await fileHandle.getFile();
  };

  const write: WriteFile = async (file: File | FileSystemWriteChunkType) => {
    const writableHandle = await fileHandle.createWritable();

    const data: FileSystemWriteChunkType =
      file instanceof File ? await file.arrayBuffer() : file;

    await writableHandle.write(data);

    await writableHandle.close();
  };

  return {
    read,
    write,
  };
};
