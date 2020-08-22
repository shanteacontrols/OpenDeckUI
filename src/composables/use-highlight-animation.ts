import { computed, ref } from "vue";
import { delay } from "../util";

interface IUseHighlightAnimation {
  isHighlighted: (highlightRef: Ref<number>) => Computed<Ref<boolean>>;
}

export const useHighlightAnimation = (
  highlightRef: Ref<number>,
): IUseHighlightAnimation => {
  const nowRef = ref(null);
  const refreshDelay = 10;
  const retainMs = 250;
  const update = () => (nowRef.value = new Date().getTime());

  const isHighlighted = computed(() => {
    const val =
      highlightRef.value && nowRef.value - highlightRef.value < retainMs;
    if (val) {
      delay(refreshDelay).then(update);
    }
    return val;
  });

  return {
    isHighlighted,
  };
};
