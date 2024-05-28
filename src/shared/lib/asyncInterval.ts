export const createAsyncInterval = async <F extends () => unknown>(
  f: F,
  timeout: number,
): Promise<() => void> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const createTimeout = () => {
    timeoutId = setTimeout(async () => {
      await f();
      createTimeout();
    }, timeout);
  };

  const stopInterval = () => {
    clearTimeout(timeoutId);
  };

  await f();

  createTimeout();

  return stopInterval;
};
