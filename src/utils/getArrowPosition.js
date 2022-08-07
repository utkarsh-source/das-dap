export const getArrowPosition = (targetPos) => {
  let arrowPosition = {
    top: {
      top: 0,
      left: "50%",
      transform: "translate(-50%, -50%) rotate(45deg)",
    },
    right: {
      top: "20px",
      right: 0,
      transform: `translate(50%, -50%) rotate(45deg)`,
    },
    left: {
      top: "20px",
      left: 0,
      transform: `translate(-50%, -50%) rotate(45deg)`,
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: `translate(-50%, -50%) rotate(45deg)`,
    },
    topLeft: {
      top: 0,
      left: "15px",
      transform: `translate(0 , -50%) rotate(45deg)`,
    },
    topRigft: {
      top: 0,
      right: "15px",
      transform: `translate(0 , -50%) rotate(45deg)`,
    },
    bottomRight: {
      top: "100%",
      right: "15px",
      transform: `translate(0, -50%) rotate(45deg)`,
    },
    bottomLeft: {
      top: "100%",
      left: "15px",
      transform: `translate(0, -50%) rotate(45deg)`,
    },
  };
  switch (targetPos) {
    case "center":
    case "top": {
      return arrowPosition.top;
    }
    case "left": {
      return arrowPosition.left;
    }
    case "right": {
      return arrowPosition.right;
    }
    case "bottom": {
      return arrowPosition.bottom;
    }
    case "bottomright": {
      return arrowPosition.bottomRight;
    }
    case "topleft": {
      return arrowPosition.topLeft;
    }
    case "bottomleft": {
      return arrowPosition.bottomLeft;
    }
    case "topright": {
      return arrowPosition.topRigft;
    }
  }
};
