export const getTooltipPosition = (
  pos,
  top,
  left,
  width,
  height,
  relX,
  relY
) => {
  let [translateX, translateY] = [0, 0];
  let offX = (relX * width) / 100;
  let offY = (relY * height) / 100;

  const arrowOffset = 25;

  switch (pos) {
    case "center":
    case "top": {
      top += offY + arrowOffset;
      left += offX;
      translateX = -50;
      break;
    }
    case "left": {
      left += offX + arrowOffset;
      top += offY - 15;
      break;
    }
    case "right": {
      top += offY - 15;
      left += offX - arrowOffset;
      translateX = -100;
      break;
    }
    case "bottom": {
      top += offY - arrowOffset;
      left += offX;
      translateX = -50;
      translateY = -100;
      break;
    }
    case "topleft": {
      top += offY + arrowOffset;
      left += offX;
      break;
    }
    case "topright": {
      top += offY + arrowOffset;
      left += offX + 25;
      translateX = -100;
      break;
    }
    case "bottomleft": {
      top += offY - arrowOffset;
      left += offX - 15;
      translateY = -100;
      break;
    }
    case "bottomright": {
      top += offY - arrowOffset;
      left += offX + 25;
      translateX = -100;
      translateY = -100;
      break;
    }
  }

  return {
    top,
    left,
    translateX,
    translateY,
  };
};
