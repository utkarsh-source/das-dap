export const getTargetPosition = (element) => {
  let pos = [];
  let [OfTop, OfLeft, OfRight, OfBottom] = [50, 200, 200, 200];
  let { top, left, width, height } = element.getBoundingClientRect();
  if (top <= OfTop) {
    pos.push("top");
  } else if (top + height >= document.documentElement.clientHeight - OfBottom) {
    pos.push("bottom");
  }

  if (left <= OfLeft) {
    pos.push("left");
  } else if (left + width >= document.documentElement.clientWidth - OfRight) {
    pos.push("right");
  }

  return {
    top,
    left,
    width,
    height,
    pos: pos.join("") || "center",
  };
};
