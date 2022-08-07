import { getArrowPosition } from "./getArrowPosition";
import { getTargetPosition } from "./getTargetPosition";
import { getTooltipPosition } from "./getTooltipPosition";

export const calculateTooltipPosition = (target, tooltipRequisites) => {
  const { top, left, width, height, pos } = getTargetPosition(target);
  const {
    title = "",
    message = "",
    actionType = "",
    relX,
    relY,
  } = tooltipRequisites;
  const arrowPos = getArrowPosition(pos);
  const {
    top: t,
    left: l,
    translateX,
    translateY,
  } = getTooltipPosition(pos, top, left, width, height, relX, relY);
  return {
    value: true,
    top: t,
    left: l,
    translateX,
    translateY,
    arrowPos,
    title,
    taskMessage: message,
    actionType,
    relX,
    relY,
  };
};
