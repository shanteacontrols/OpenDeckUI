import { reactive } from "vue";

type ConfirmPromptResolver = (confirmed: boolean) => void;

interface IConfirmPromptState {
  visible: boolean;
  message: string;
  resolver: ConfirmPromptResolver | null;
}

export const confirmPromptState = reactive<IConfirmPromptState>({
  visible: false,
  message: "",
  resolver: null,
});

const resolveConfirmPrompt = (confirmed: boolean): void => {
  const resolver = confirmPromptState.resolver;

  confirmPromptState.visible = false;
  confirmPromptState.message = "";
  confirmPromptState.resolver = null;

  if (resolver) {
    resolver(confirmed);
  }
};

export const confirmPrompt = (message: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (confirmPromptState.resolver) {
      resolveConfirmPrompt(false);
    }

    confirmPromptState.message = message;
    confirmPromptState.resolver = resolve;
    confirmPromptState.visible = true;
  });

export const acceptConfirmPrompt = (): void => resolveConfirmPrompt(true);

export const cancelConfirmPrompt = (): void => resolveConfirmPrompt(false);

export const useConfirmPrompt = (
  message: string,
  callback: () => void | Promise<void>,
) => async (): Promise<void> => {
  const confirmed = await confirmPrompt(message);
  if (!confirmed) return;
  await callback();
};
