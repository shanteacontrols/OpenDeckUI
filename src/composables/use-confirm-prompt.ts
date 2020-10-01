export const useConfirmPrompt = (
  message: string,
  callback: () => void,
) => (): void => {
  const confirmed = window.confirm(message);
  if (!confirmed) return false;
  callback();
};
