import { reactive } from "vue";

type ConfirmPromptResolver = (confirmed: boolean) => void;

interface IConfirmPromptState {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  showCancel: boolean;
  resolver: ConfirmPromptResolver | null;
}

export const confirmPromptState = reactive<IConfirmPromptState>({
  visible: false,
  title: "",
  message: "",
  confirmLabel: "",
  showCancel: true,
  resolver: null,
});

const resolveConfirmPrompt = (confirmed: boolean): void => {
  const resolver = confirmPromptState.resolver;

  confirmPromptState.visible = false;
  confirmPromptState.title = "";
  confirmPromptState.message = "";
  confirmPromptState.confirmLabel = "";
  confirmPromptState.showCancel = true;
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

    confirmPromptState.title = "Confirm action";
    confirmPromptState.message = message;
    confirmPromptState.confirmLabel = "Continue";
    confirmPromptState.showCancel = true;
    confirmPromptState.resolver = resolve;
    confirmPromptState.visible = true;
  });

export const alertPrompt = (
  title: string,
  message: string,
  confirmLabel = "OK",
): Promise<void> =>
  new Promise((resolve) => {
    if (confirmPromptState.resolver) {
      resolveConfirmPrompt(false);
    }

    confirmPromptState.title = title;
    confirmPromptState.message = message;
    confirmPromptState.confirmLabel = confirmLabel;
    confirmPromptState.showCancel = false;
    confirmPromptState.resolver = () => resolve();
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
