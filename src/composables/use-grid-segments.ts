import { computed } from "vue";

export interface GridSegment {
  title: string;
  startIndex: number;
  endIndex: number;
  indexArray?: number[]; // Calculated here in a computed
}
interface gridSegmentComposable {
  segments: Computed<GridSegment[]>;
}

export const useGridSegments = (
  gridSegments: Ref<GridSegment[]>,
): gridSegmentComposable => {
  const segments = computed(() =>
    gridSegments.value ? gridSegments.value.map(addGridSegmentIndexArray) : [],
  );

  return {
    segments,
  };
};

const addGridSegmentIndexArray = (seg: GridSegment): GridSegment => {
  const indexArray: Array<number> = [];
  for (let i = seg.startIndex; i <= seg.endIndex; i++) {
    indexArray.push(i);
  }
  return {
    ...seg,
    indexArray,
  };
};
