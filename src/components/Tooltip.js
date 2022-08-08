import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../../AppContext";
import toast from "react-hot-toast";
import { FaAngleRight } from "react-icons/fa";
import { getFlowData } from "../helper/flowData";
import {
  Button,
  ButtonRounded,
  ButtonWrapper,
  Dropdown,
  PopupWrapper,
  ToastBox,
  ToastButtonBox,
  ToastMessage,
  TooltipBox,
} from "../styled-component";
import { createFlow } from "../action/action";
import { removeFocusTrapListener, trapFocus } from "../utils/trapFocus";
import { IoClose } from "react-icons/io5";
import {
  GoAlert,
  GoCheck,
  GoChevronDown,
  GoChevronUp,
  GoX,
} from "react-icons/go";

const actionTypes = ["Input", "Popup", "Dropdown", "Clickable", "Hover"];

const Tooltip = (props) => {
  const {
    targetElem,
    setToggleViewMode,
    top,
    left,
    relX,
    relY,
    flowName,
    setTooltip,
    flowData,
    stepsCount,
    translateY,
    translateX,
    applicationName,
    setProgress,
    enableClick,
    setInit,
    timerRef,
    children,
  } = props;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionType, setActionType] = useState("Clickable");
  const [toggleSelect, setToggleSelect] = useState(false);

  const {
    dispatch,
    state: {
      login: { token, databaseID },
    },
  } = useContext(AppContext);

  const tooltipRef = useRef();

  const submitData = () => {
    if (!title || !message) {
      toast((tst) => (
        <div>
          <ToastMessage>
            <GoAlert /> No fields can be empty!
          </ToastMessage>
        </div>
      ));
      return;
    }
    stepsCount.current++;
    enableClick();
    setProgress({ state: "off" });
    setToggleViewMode(false);
    setInit(false);
    setTooltip({ value: false });
    clearInterval(timerRef.current);
    flowData.current[flowName] = {
      ...flowData.current[flowName],
      ["step" + stepsCount.current]: {
        title,
        message,
        actionType,
        targetElement: targetElem.current,
        targetUrl: window.location.href,
        customUrl: window.location.href,
        targetClickOffsetX: relX,
        targetClickOffsetY: relY,
      },
    };
    chrome?.storage.sync.remove([
      "applicationName",
      "flowData",
      "stepsCount",
      "flowName",
      "previewStepCount",
      "progress",
      "toggleViewMode",
      "init",
    ]);
    const flowDataFormat = getFlowData(
      flowData.current,
      flowName,
      applicationName
    );
    createFlow(dispatch, databaseID, token, flowDataFormat, setProgress);
  };

  const addNextStep = (e) => {
    if (!title || !message) {
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />
            No fields can be empty!
          </ToastMessage>
        </ToastBox>
      ));
      return;
    }
    stepsCount.current++;
    removeFocusTrapListener(tooltipRef.current);
    clearInterval(timerRef.current);
    enableClick();
    setInit(true);
    setTooltip({ value: false });
    flowData.current[flowName] = {
      ...flowData.current[flowName],
      ["step" + stepsCount.current]: {
        title,
        message,
        actionType,
        targetElement: targetElem.current,
        customUrl: window.location.href,
        targetUrl: window.location.href,
        targetClickOffsetX: relX,
        targetClickOffsetY: relY,
      },
    };
  };

  const handleDismisTooltip = () => {
    clearInterval(timerRef.current);
    enableClick();
    setInit(true);
    setTooltip({ value: false });
    targetElem.current = null;
  };

  useEffect(() => {
    trapFocus(tooltipRef.current);
  }, []);

  return (
    top &&
    left && (
      <TooltipBox
        ref={tooltipRef}
        style={{
          top: top + "px",
          left: left + "px",
          transform: `translate(${translateX}%, ${translateY}%)`,
        }}
      >
        <div>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          <IoClose as="button" onClick={handleDismisTooltip} />
        </div>

        <textarea
          value={message}
          placeholder="Description..."
          onChange={(e) => setMessage(e.target.value)}
        />

        <Dropdown
          tabIndex={0}
          onBlur={() => setToggleSelect(false)}
          onMouseDown={() => setToggleSelect(!toggleSelect)}
        >
          <div>
            <span>{actionType}</span>
            {toggleSelect ? <GoChevronUp /> : <GoChevronDown />}
          </div>
          <ul data-toggle={toggleSelect}>
            {actionTypes.map((action, index) => {
              return (
                <li onMouseDown={(e) => setActionType(action)} key={index}>
                  {action}
                </li>
              );
            })}
          </ul>
        </Dropdown>

        <ButtonWrapper>
          <Button primary onClick={submitData}>
            Done
          </Button>
          <Button onClick={addNextStep}>
            Next <FaAngleRight style={{ marginLeft: "5px" }} />
          </Button>
        </ButtonWrapper>
        {children}
      </TooltipBox>
    )
  );
};

export default Tooltip;
