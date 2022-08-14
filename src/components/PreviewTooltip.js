import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  Button,
  ButtonWrapper,
  PopupWrapper,
  PreviewTooltip,
} from "../styled-component";

const PreviewDescriptionTooltip = (props) => {
  const {
    title,
    taskMessage,
    actionType,
    top,
    left,
    translateX,
    translateY,
    showNextTooltip,
    targetRef,
    children,
    flowName,
  } = props;

  return (
    <PreviewTooltip
      style={{
        top: top + "px",
        left: left + "px",
        transform: `translate(${translateX}%, ${translateY}%)`,
      }}
    >
      <p>{title}</p>
      <div>
        {" "}
        <p>{taskMessage}</p>
      </div>
      <span>
        {!["Input", "Clickable"].includes(actionType) &&
          "* please click on the target to proceed.!"}
      </span>
      <ButtonWrapper>
        <Button
          style={{ width: "max-content", flexGrow: 0, marginLeft: "auto" }}
          disabled={!["Input", "Clickable"].includes(actionType)}
          onClick={() =>
            showNextTooltip(actionType, targetRef, flowName, false)
          }
          primary
        >
          Next <FaAngleRight />{" "}
        </Button>
      </ButtonWrapper>
      {children}
    </PreviewTooltip>
  );
};

export default PreviewDescriptionTooltip;
