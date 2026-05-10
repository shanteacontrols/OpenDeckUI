export const confirmPrompt = (message: string): boolean =>
  window.confirm(message);

export const useConfirmPrompt = (
  message: string,
  callback: () => void,
) => (): void => {
  const confirmed = confirmPrompt(message);
  if (!confirmed) return;
  callback();
};
