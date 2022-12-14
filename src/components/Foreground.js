import React from "react";
import { createPortal } from "react-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../../AppContext";
import { MdLogout } from "react-icons/md";
import { IoClose, IoFilterSharp } from "react-icons/io5";
import {
  GoAlert,
  GoEye,
  GoX,
  GoThumbsup,
  GoPrimitiveDot,
  GoVerified,
  GoSearch,
} from "react-icons/go";
import { GrBraille, GrEdit } from "react-icons/gr";
import Tooltip from "./Tooltip";
import {
  createFlow,
  deleteTaskFlow,
  viewFlows,
  logout,
  viewFeedback,
} from "../action/action";
import { toast } from "react-hot-toast";
import { BsPlus, BsPlusLg, BsThreeDots } from "react-icons/bs";
import ReactLoading from "react-loading";
import { getFlowData } from "../helper/flowData";
import { BiMessageAlt } from "react-icons/bi";
import Annoucement from "./Annoucement";
import {
  Arrow,
  Badge,
  Box,
  Button,
  ButtonWrapper,
  ErrorMessage,
  Feedback,
  FlexBox,
  FlowManager,
  FormBox,
  FormContainer,
  HighlighterTooltip,
  HoverHighlighter,
  InfoBox,
  LabeledInput,
  Loader,
  PopupWrapper,
  PreviewBox,
  Settings,
  ToastBox,
  ToastButtonBox,
  ToastMessage,
  TooltipEditor,
} from "../styled-component";
import PreviewDescriptionTooltip from "./PreviewTooltip";
import { getCssSelector } from "css-selector-generator";
import { removeFocusTrapListener, trapFocus } from "../utils/trapFocus";
import createFlowImage from "../assets/createFlowImage.svg";
import { VIEW__FLOWS__SUCCESS } from "../action/actionType";
import { getTargetPosition } from "../utils/getTargetPosition";

import { calculateTooltipPosition } from "../utils/calculateTooltipPosition";

function onRePosition(target, tooltipRequisites, timerRef, callBack) {
  let { top, left } = target.getBoundingClientRect();

  callBack(calculateTooltipPosition(target, tooltipRequisites));

  timerRef.current = setInterval(() => {
    let currentRect = target.getBoundingClientRect();

    if (top !== currentRect.top || left !== currentRect.left) {
      top = currentRect.top;
      left = currentRect.left;
      callBack(calculateTooltipPosition(target, tooltipRequisites));
    }
  }, 50);
}

// function closestScrollableParent(target) {
//   if (target.tagName === "BODY") return window;
//   let computedstyle = window.getComputedStyle(target);
//   if (["scroll"].includes(computedstyle.getPropertyValue("overflow-y"))) {
//     return target;
//   }
//   return closestScrollableParent(target.parentElement);
// }

function disableClick() {
  document.body.style.pointerEvents = "none";
}

function enableClick() {
  document.body.style.pointerEvents = "auto";
}

const getTargetClickPosition = (e, top, left, width, height) => {
  let [clickX, clickY] = [Math.round(e.clientX), Math.round(e.clientY)];
  let [perX, perY] = [
    Math.round(((clickX - left) / width) * 100),
    Math.round(((clickY - top) / height) * 100),
  ];
  return {
    relX: perX,
    relY: perY,
  };
};

function Foreground() {
  const {
    dispatch,
    state: {
      login: { token, databaseID },
      flows,
      feedback,
    },
  } = useContext(AppContext);

  const [editedUrl, setUrl] = useState({});
  const [tooltipEditor, setTooltipEditor] = useState({});
  const [flowName, setFlowName] = useState("");
  const [toggleCreateFlowPopup, setToggleCreateFlowPopup] = useState(false);
  const [progress, setProgress] = useState({
    state: "off",
  });
  const [toggleFeedback, setToggleFeddback] = useState(false);
  const [box, setBox] = useState({ value: false });
  const [showTooltip, setTooltip] = useState({
    value: false,
  });
  const [showExistingFlow, setShowExistingFlow] = useState(false);
  const [applicationName, setApplicationName] = useState("");
  const [init, setInit] = useState(false);
  const [toggleAnnouncement, setToggleAnnouncement] = useState(false);
  const [toggleViewMode, setToggleViewMode] = useState(false);
  const [tooltipData, setTooltipData] = useState({});

  const timerRef = useRef(null);

  const flowsDataRef = useRef([]);

  const popupRef = useRef();

  const editorRef = useRef({});

  const previewStepCount = useRef({ value: 1 });

  const stepsCount = useRef(0);

  const targetElem = useRef({
    index: null,
    tagName: "",
  });

  const targetRef = useRef(null);

  const highlighterRef = useRef();

  const flowData = useRef({});

  const onTargetPressed = (taskName, actionType, target) => {
    clearInterval(timerRef.current);
    setTooltip({ value: false });
    showNextTooltip(actionType, target, taskName, true, true);
  };

  const stopFlowView = () => {
    targetRef.current.removeEventListener("click", onTargetPressed);
    chrome?.storage?.sync.remove(["toggleViewMode"]);
    previewStepCount.current = {
      value: 1,
    };
    clearInterval(timerRef.current);
    setToggleViewMode(false);
    setTooltip({ value: false });
  };

  const showNextTooltip = (
    actionType,
    target,
    taskName,
    isUserNavigated,
    bypassUrlCheck
  ) => {
    if (actionType === "Input" && !target.current.value) {
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert /> Please enter something !
          </ToastMessage>
        </ToastBox>
      ));
      return;
    }
    previewStepCount.current.value++;
    previewStepCount.current.action = "next";
    chrome.storage.sync.set({
      flowData: flowData.current,
      stepsCount: stepsCount.current,
      previewStepCount: previewStepCount.current.value,
      progress: progress.state,
      flowName: taskName,
      applicationName,
      init,
      toggleViewMode: true,
    });
    if (previewStepCount.current.value > stepsCount.current) {
      chrome?.storage?.sync.remove(["toggleViewMode"]);
      stopFlowView();
      toast(
        (tst) => (
          <ToastBox>
            <ToastMessage>
              <GoVerified style={{ color: "lightgreen" }} /> Flow Completed
            </ToastMessage>
          </ToastBox>
        ),
        {
          duration: 1000,
        }
      );
    } else {
      const { targetUrl } =
        flowData.current[taskName]["step" + previewStepCount.current.value];

      console.log(previewStepCount.current.value);
      console.log(targetUrl);

      if (targetUrl === window.location.href) clearInterval(timerRef.current);

      if (isUserNavigated) {
        setTimeout(() => {
          viewFlow(taskName, null, bypassUrlCheck);
        }, 1500);
      } else {
        viewFlow(taskName, null, bypassUrlCheck);
      }
    }
  };

  const appendPreviewTooltip = (target, info) => {
    const tooltipRequisites = {
      title: info.title,
      message: info.message,
      actionType: info.actionType,
      relX: info.targetClickOffsetX,
      relY: info.targetClickOffsetY,
    };

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    onRePosition(target, tooltipRequisites, timerRef, setTooltip);
  };

  const preventDefaultAction = (e) => {
    const target = e.target;
    e.preventDefault(); // to stop Focus Events on Target Element()
    e.stopPropagation();
    e.stopImmediatePropagation();
    disableClick();
    const cssSelector = getCssSelector(target, {
      selectors: ["nthoftype", "nthchild", "tag"],
    });
    targetElem.current = {
      cssSelector,
      tagName: target.tagName,
    };
    setInit(false);
    appendTooltip(e);
    window.currentTarget.removeEventListener(
      "pointerdown",
      preventDefaultAction
    );
  };

  const handleHoverInpect = (e) => {
    let target = e.target;

    if (!target.tagName) return;

    if (window.currentTarget && target !== window.currentTarget) {
      window.currentTarget.removeEventListener(
        "pointerdown",
        preventDefaultAction
      );
    }

    window.currentTarget = target;

    let { pos, top, left, width, height } = getTargetPosition(target);

    let translateX = "-3px";
    let translateY = 0;

    switch (pos) {
      case "top":
      case "topright":
      case "topleft": {
        translateY = height + 10 + "px";
        translateY = height + 10 + "px";
        break;
      }
      case "center":
      case "left":
      case "right":
      case "bottom":
      case "bottomleft":
      case "bottomright": {
        translateY = "calc(-100% - 10px)";
        break;
      }
    }

    setBox({
      value: true,
      translateX,
      translateY,
      top,
      left,
      width,
      height,
      tagName: target.tagName,
    });

    target.addEventListener("pointerdown", preventDefaultAction);
  };

  const appendTooltip = (e) => {
    const target = e.target;
    const { top, left, width, height, pos } = getTargetPosition(target);
    const { relX, relY } = getTargetClickPosition(e, top, left, width, height);
    const tooltip_requisites = {
      relX,
      relY,
    };
    setBox({ value: false });
    onRePosition(target, tooltip_requisites, timerRef, setTooltip);
  };

  const handleLogout = () => {
    disableClick();
    toast(
      (tst) => (
        <ToastBox>
          <div>
            <ToastMessage>
              <GoAlert /> Process will clear your data!
            </ToastMessage>
            <ToastButtonBox>
              <button
                onClick={() => {
                  enableClick();
                  toast.remove(tst.id);
                }}
              >
                cancel
              </button>
              <button
                onClick={() => {
                  enableClick();
                  logout(dispatch, databaseID, token);
                  toast.remove(tst.id);
                }}
              >
                Ok
              </button>
            </ToastButtonBox>
          </div>
        </ToastBox>
      ),
      {
        id: "page__change__popup",
        duration: Infinity,
      }
    );
  };

  const handleRemoveHoverInpect = (e) => {
    if (e.key === "Escape") {
      window.currentTarget.removeEventListener(
        "pointerdown",
        preventDefaultAction
      );
      enableClick();
      chrome?.storage?.sync.set({
        flowData: flowData.current,
        stepsCount: stepsCount.current,
        previewStepCount: previewStepCount.current.value,
        progress: stepsCount.current > 0 ? "paused" : "off",
        flowName,
        applicationName,
        toggleViewMode: false,
        init,
      });
      setProgress({ state: stepsCount.current > 0 ? "paused" : "off" });
      setInit(false);
      setBox({ value: false });
      setTooltip({ value: false });
    }
  };

  const addHoverInspect = () => {
    if (!flowName) {
      toast((tst) => (
        <ToastBox>
          <div>
            <ToastMessage>
              <GoAlert /> Use Case is required to proceed !
            </ToastMessage>
          </div>
        </ToastBox>
      ));
      return;
    }
    removeFocusTrapListener(popupRef.current);
    enableClick();
    setInit(true);
    setProgress({ state: "on" });
    setToggleCreateFlowPopup(false);
  };

  const initFlowCreation = (value) => {
    trapFocus(popupRef.current);
    setToggleViewMode(false);
    setToggleCreateFlowPopup(value);
    setTooltip({ value: false });
    stepsCount.current = 0;
    setShowExistingFlow(false);
  };

  useEffect(() => {
    if (showExistingFlow) viewFlows(dispatch, databaseID, token, flowsDataRef);
  }, [showExistingFlow]);

  function getDomain(url) {
    return url.split("/")[2].split(".").slice(-2)[0];
  }

  function isCurrentDomain(targetUrl) {
    const currentDomain = getDomain(window.location.href);

    const targetUrlDomain = getDomain(targetUrl);

    return currentDomain === targetUrlDomain;
  }

  const findTarget = (targetInfo) => {
    let { cssSelector } = targetInfo;
    const delay = 100;
    return new Promise((resolve, reject) => {
      let cummulativeDelay = 0;
      const a = () => {
        let target = document.body.querySelector(cssSelector);
        if (!target) {
          if (cummulativeDelay >= 20000) {
            reject("Failed to find target!");
          } else {
            setTimeout(() => {
              cummulativeDelay += delay;
              target = a();
            }, delay);
          }
        } else {
          resolve(target);
        }

        return target;
      };
      a();
    });
  };

  const convertToRegexExp = (url) => {
    const escapedUrl = url.replace(/[\?\+\$\.\=\/]/g, (match) => `\\${match}`);

    const hasCatchAll = /({all})/.test(url);

    const regExp =
      (hasCatchAll
        ? escapedUrl
            .slice(0, escapedUrl.indexOf("{all}") + 5)
            .replace(/{all}/, "[\\w\\/\\=\\?#\\$]*")
        : escapedUrl.replace(/{any}/g, "\\w+")) + "$";

    return regExp;
  };

  const isCurrentUrl = (customUrl, url) => {
    return new RegExp(convertToRegexExp(customUrl)).test(
      url || window.location.href
    );
  };

  const viewFlow = (taskName, url, bypassUrlCheck) => {
    const { targetUrl, customUrl, actionType, targetElement } =
      flowData.current[taskName]["step" + previewStepCount.current.value];
    if (isCurrentDomain(targetUrl)) {
      if (bypassUrlCheck || isCurrentUrl(customUrl, url)) {
        findTarget(targetElement)
          .then((target) => {
            if (!target) return;
            targetRef.current = target;
            if (["Clickable", "Dropdown", "Popup"].includes(actionType)) {
              target.addEventListener(
                "click",
                () => onTargetPressed(taskName, actionType, target, customUrl),
                {
                  once: true,
                }
              );
            } else if (actionType === "Hover") {
              target.addEventListener(
                "hover",
                () => onTargetPressed(taskName, actionType, target),
                {
                  once: true,
                }
              );
            }
            const info =
              flowData.current[taskName][
                "step" + previewStepCount.current.value
              ];
            appendPreviewTooltip(target, info);
          })
          .catch((err) => {
            stopFlowView();
            toast((tst) => (
              <ToastBox>
                <ToastMessage>
                  <GoAlert /> {err}
                </ToastMessage>
              </ToastBox>
            ));
          });
      } else {
        handlePageChange(taskName);
      }
    } else {
      toast(
        (tst) => (
          <ToastBox>
            <ToastMessage>
              <GoAlert />
              Flow does not belong to this domain !
            </ToastMessage>
          </ToastBox>
        ),
        {
          duration: 1000,
        }
      );
    }
  };

  const discardProgress = () => {
    enableClick();
    setToggleViewMode(false);
    setTooltip({ value: false });
    setFlowName("");
    setApplicationName("");
    setInit(false);
    setProgress({ state: "off" });
    flowData.current[flowName] = {};
    stepsCount.current = 0;
    chrome?.storage?.sync.remove([
      "applicationName",
      "flowData",
      "stepsCount",
      "flowName",
      "previewStepCount",
      "progress",
      "toggleViewMode",
      "init",
    ]);
    chrome?.storage?.sync.set({ tabUrl: window.location.href });
  };

  const handlePageChange = (taskName) => {
    clearInterval(timerRef.current);
    chrome.storage.sync.set({
      flowData: flowData.current,
      stepsCount: stepsCount.current,
      previewStepCount: previewStepCount.current.value,
      progress: progress.state,
      flowName: taskName,
      applicationName,
      init,
      toggleViewMode: true,
    });
    let URL_TO_NAVIGATE =
      flowData.current[taskName]["step" + previewStepCount.current.value]
        ?.targetUrl;
    window.location.href = URL_TO_NAVIGATE;
  };

  const viewExistingFlow = (flow) => {
    setShowExistingFlow(false);
    const { applicationTaskFlowUseCase, taskList, applicationURL } = flow;
    if (!applicationURL.includes(getDomain(window.location.href))) {
      disableClick();
      toast(
        (tst) => (
          <ToastBox>
            <ToastMessage>
              <GoAlert />
              Flow does not belong to this domain visit:-
            </ToastMessage>
            <ToastButtonBox>
              <button
                primary
                onClick={() => {
                  enableClick();
                  const port = chrome?.runtime.connect({
                    name: "content_script",
                  });
                  port.postMessage({ type: "newTab", url: targetUrl });
                  toast.remove(tst.id);
                }}
              >
                cancel
              </button>
              <button
                onClick={() => {
                  enableClick();
                  toast.remove(tst.id);
                }}
              >
                Proceed
              </button>
            </ToastButtonBox>
          </ToastBox>
        ),
        {
          id: "flow__view__error__popup",
          duration: Infinity,
        }
      );
      return;
    }

    setFlowName(applicationTaskFlowUseCase);

    flowData.current[applicationTaskFlowUseCase] = {};

    taskList.forEach((task) => {
      flowData.current[applicationTaskFlowUseCase]["step" + task.stepNumber] = {
        targetElement: {
          tagName: task.htmlTag,
          cssSelector: task.cssSelector,
        },
        message: task.taskMessage,
        actionType: task.actionType,
        targetUrl: task.targetURL,
        customUrl: task.customURL,
        title: task.title,
        targetClickOffsetX: task.targetClickOffsetX,
        targetClickOffsetY: task.targetClickOffsetY,
      };
    });

    stepsCount.current = taskList.length;
    previewStepCount.current = {
      value: 1,
    };

    setToggleViewMode(true);

    viewFlow(applicationTaskFlowUseCase);
  };

  const submitData = () => {
    setToggleViewMode(false);
    chrome?.storage?.sync.remove([
      "applicationName",
      "flowData",
      "stepsCount",
      "flowName",
      "previewStepCount",
      "progress",
      "toggleViewMode",
      "init",
    ]);
    setTooltip({ value: false });
    const data = getFlowData(flowData.current, flowName, applicationName);
    flowData.current[flowName] = null;
    stepsCount.current = 0;
    createFlow(dispatch, databaseID, token, data, setProgress);
  };

  const deleteExistingFlow = (flowUseCaseName) => {
    disableClick();
    toast(
      (tst) => (
        <ToastBox>
          <div>
            <ToastMessage>
              <GoAlert /> Are you sure ?
            </ToastMessage>
            <ToastButtonBox>
              <button
                onClick={() => {
                  enableClick();
                  toast.remove(tst.id);
                }}
              >
                cancel
              </button>
              <button
                onClick={() => {
                  enableClick();
                  deleteTaskFlow(
                    dispatch,
                    databaseID,
                    token,
                    flowUseCaseName,
                    flowsDataRef
                  );
                  toast.remove(tst.id);
                }}
              >
                Ok
              </button>
            </ToastButtonBox>
          </div>
        </ToastBox>
      ),
      {
        id: "flow__delete_popup",
        duration: Infinity,
      }
    );
  };

  function editStep(step, domain) {
    toast((tst) => (
      <ToastBox>
        <div>
          <ToastMessage>
            <GoVerified style={{ color: "lightgreen" }} />
            Saved Successfully
          </ToastMessage>
        </div>
      </ToastBox>
    ));

    flowData.current[flowName][step] = {
      ...flowData.current[flowName][step],
      customUrl: domain + editedUrl[step],
    };

    setTooltipEditor({ [step]: false });
  }

  const isMatching = (editedUrl, originalUrl) => {
    const regExp = convertToRegexExp(editedUrl);
    return new RegExp(regExp).test(originalUrl);
  };

  const filterFlow = (e) => {
    const value = e.target.value;
    const regExp = new RegExp(`^${value}`, "i");
    const filteredFlows = flowsDataRef.current.filter((flow) =>
      regExp.test(flow.applicationTaskFlowUseCase)
    );
    if (!filteredFlows.length) {
      dispatch({ type: VIEW__FLOWS__SUCCESS, payload: flows.data });
    } else {
      dispatch({
        type: VIEW__FLOWS__SUCCESS,
        payload: filteredFlows,
      });
    }
  };

  useEffect(() => {
    if (init) {
      document.addEventListener("keydown", handleRemoveHoverInpect);
      document.addEventListener("pointerover", handleHoverInpect);
      return () => {
        document.removeEventListener("keydown", handleRemoveHoverInpect);
        document.removeEventListener("pointerover", handleHoverInpect);
      };
    }
  }, [init]);

  useEffect(() => {
    if (toggleFeedback) {
      viewFeedback(dispatch, databaseID, token);
    }
  }, [toggleFeedback]);

  useEffect(() => {
    chrome?.storage?.sync.get(
      [
        "flowData",
        "stepsCount",
        "flowName",
        "previewStepCount",
        "progress",
        "applicationName",
        "toggleViewMode",
      ],
      function (savedData) {
        if (Object.keys(savedData).length > 0) {
          stepsCount.current = savedData.stepsCount;
          previewStepCount.current = { value: savedData.previewStepCount };
          setInit(savedData.init);
          if (savedData.flowName) {
            flowData.current[savedData.flowName] =
              savedData.flowData[savedData.flowName];
            if (savedData.toggleViewMode) {
              setToggleViewMode(savedData.toggleViewMode);
              setTimeout(() => {
                viewFlow(savedData.flowName, window.location.href);
              }, 500);
            }
            setFlowName(savedData.flowName);
            setApplicationName(savedData.applicationName);
            setProgress({ state: savedData.progress });
          }
        }
      }
    );
  }, []);

  return (
    <>
      <div>
        <Settings
          toggle={
            (["paused", "off"].includes(progress.state) && !toggleViewMode) ||
            undefined
          }
        >
          <FlexBox>
            {token && (
              <Button primary onClick={handleLogout}>
                <MdLogout /> <span>Logout</span>
              </Button>
            )}
            {/* <Button onClick={() => setToggleAnnouncement(true)}>
              <GoMegaphone />
              <span>Announcements</span>
            </Button> */}
            <Button primary onClick={() => setShowExistingFlow(true)}>
              <GoSearch />
              <span>Flow Manager</span>
            </Button>
            {progress.state === "paused" && stepsCount.current > 0 && (
              <Button
                onClick={() => {
                  setToggleViewMode(true);
                  viewFlow(flowName);
                }}
              >
                <GoEye />
                <span>Preview</span>
              </Button>
            )}{" "}
          </FlexBox>
          <Box>
            {flowName &&
              stepsCount.current > 0 &&
              progress.state === "paused" &&
              Object.entries(flowData.current?.[flowName]).map(
                ([step, stepData]) => {
                  const [protocol, slash = "//", domain] = stepData.targetUrl
                    ?.split("/")
                    .splice(0, 3);
                  const rest = stepData.targetUrl.slice(
                    stepData.targetUrl.match(/(?<!\/)\/(?!\/)/).index
                  );
                  return (
                    <React.Fragment key={step}>
                      <div>
                        <Button
                          title={step}
                          primary
                          onClick={() => {
                            trapFocus(editorRef.current[step]);
                            setTooltipEditor((prev) => ({
                              [step]: true,
                            }));
                          }}
                        >
                          <BiMessageAlt style={{ margin: 0 }} />
                          <Badge>{step.slice(-1)}</Badge>
                        </Button>
                        {step.slice(-1) != stepsCount.current && (
                          <BsPlus style={{ fontSizde: "15px" }} />
                        )}
                      </div>
                      {createPortal(
                        <PopupWrapper toggle={tooltipEditor[step] || undefined}>
                          <TooltipEditor
                            ref={(r) => (editorRef.current[step] = r)}
                            toggle={tooltipEditor[step] || undefined}
                          >
                            <div className="heading">
                              <h1>Edit Url :</h1>
                              <IoClose
                                as="button"
                                onClick={() => {
                                  removeFocusTrapListener(
                                    editorRef.current[step]
                                  );
                                  setTooltipEditor({ [step]: false });
                                }}
                              />
                            </div>
                            <p className="url">{stepData.targetUrl}</p>
                            <p className="instruction">
                              <span>{"{all}"}</span> match any single or
                              multiple characters including <span>/</span>
                            </p>
                            <p className="instruction">
                              <span>{"{any}"}</span> match any word between{" "}
                              <span>/</span> <BsThreeDots />
                              <span>/</span>
                            </p>
                            <div>
                              <span>{protocol + "//" + domain}</span>
                              <input
                                type="url"
                                value={editedUrl[step] || rest}
                                onChange={(e) =>
                                  setUrl((prev) => ({
                                    ...prev,
                                    [step]: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {isMatching(editedUrl[step] || rest, rest) ? (
                              <p className="matchInfo">*Match succesful</p>
                            ) : (
                              <p className="matchInfo">*could not match"</p>
                            )}

                            <ButtonWrapper>
                              <Button
                                type="button"
                                onClick={() => {
                                  setUrl("/" + rest);
                                }}
                              >
                                Reset
                              </Button>
                              <Button
                                onClick={() =>
                                  editStep(step, protocol + "//" + domain)
                                }
                                primary
                              >
                                Save
                              </Button>
                            </ButtonWrapper>
                          </TooltipEditor>
                        </PopupWrapper>,
                        document.querySelector("#dap__ext__foreground")
                          .shadowRoot
                      )}
                    </React.Fragment>
                  );
                }
              )}
          </Box>
          <FlexBox>
            {["off"].includes(progress.state) && (
              <Button
                onClick={() => {
                  disableClick();
                  initFlowCreation(true);
                }}
              >
                <BsPlusLg />
                <span>Create Flow</span>
              </Button>
            )}
            {stepsCount.current > 0 &&
              ["paused", "on"].includes(progress.state) && (
                <Button type="button" onClick={discardProgress}>
                  Discard{" "}
                </Button>
              )}
            {stepsCount.current > 0 && progress.state === "paused" && (
              <Button
                type="button"
                onClick={() => {
                  setInit(true);
                  setProgress({ state: "on" });
                }}
              >
                Continue{" "}
              </Button>
            )}
            {stepsCount.current > 0 &&
              ["paused", "on"].includes(progress.state) && (
                <Button onClick={submitData}>Save </Button>
              )}
            <Button
              type="button"
              primary
              onClick={() => setToggleFeddback(true)}
            >
              <GoThumbsup />
              <span>Feedback</span>
            </Button>
          </FlexBox>
        </Settings>

        <PopupWrapper toggle={toggleCreateFlowPopup}>
          <FormContainer toggle={toggleCreateFlowPopup}>
            <figure>
              <img src={createFlowImage} alt="login" />
            </figure>
            <FormBox
              ref={popupRef}
              onSubmit={(e) => {
                e.preventDefault();
                addHoverInspect();
              }}
            >
              <h1>Create Flow</h1>
              <LabeledInput>
                <GrBraille />
                <input
                  placeholder="Application Name"
                  data-label="applicationName"
                  onChange={(e) => {
                    setApplicationName(e.target.value);
                  }}
                  value={applicationName}
                  type="text"
                />
              </LabeledInput>

              <LabeledInput>
                <GrEdit />
                <input
                  placeholder="Flow Name"
                  data-label="flowName"
                  onChange={(e) => {
                    setFlowName(e.target.value);
                  }}
                  value={flowName}
                  type="text"
                />
              </LabeledInput>
              <ButtonWrapper>
                <Button
                  type="button"
                  onClick={() => {
                    enableClick();
                    initFlowCreation(false);
                    removeFocusTrapListener(popupRef.current);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" primary>
                  Add
                </Button>
              </ButtonWrapper>
            </FormBox>
          </FormContainer>
        </PopupWrapper>
      </div>
      {box.value && (
        <>
          <HoverHighlighter
            ref={highlighterRef}
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            }}
          ></HoverHighlighter>
          <HighlighterTooltip
            style={{
              top: box.top,
              left: box.left,
              transform: `translate(${box.translateX}, ${box.translateY})`,
            }}
          >
            {box.tagName}
          </HighlighterTooltip>
        </>
      )}
      {showTooltip.value &&
        (toggleViewMode ? (
          <PreviewDescriptionTooltip
            {...{
              previewStepCount,
              ...showTooltip,
              showNextTooltip,
              stepsCount,
              targetRef,
              flowName,
            }}
          >
            <Arrow style={{ ...showTooltip.arrowPos }}></Arrow>
          </PreviewDescriptionTooltip>
        ) : (
          <Tooltip
            {...{
              setProgress,
              setToggleViewMode,
              targetElem,
              stepsCount,
              setTooltip,
              flowName,
              flowData,
              ...showTooltip,
              applicationName,
              applicationName,
              disableClick,
              enableClick,
              setInit,
              timerRef,
              tooltipData,
              setTooltipData,
            }}
          >
            <Arrow style={{ ...showTooltip.arrowPos }}></Arrow>
          </Tooltip>
        ))}
      <FlowManager toggle={showExistingFlow}>
        <div className="close_btn">
          <IoClose onClick={() => setShowExistingFlow(false)} />
        </div>
        <FlexBox>
          <LabeledInput style={{ height: "45px" }}>
            <GoSearch style={{ fontSize: "30px" }} />
            <input
              onChange={filterFlow}
              type="text"
              placeholder="Search Flows"
            />
            <IoFilterSharp style={{ color: "black" }} />
          </LabeledInput>
        </FlexBox>
        {flows.isLoading ? (
          <Loader
            style={{
              backgroundColor: "transparent",
              boxShadow: "0 0 0 0 white",
            }}
          >
            <ReactLoading type="spinningBubbles" height={60} width={60} />
          </Loader>
        ) : flows.data.length > 0 ? (
          <ul>
            {flows.data.map((flow) => {
              return (
                <li onClick={() => viewExistingFlow(flow)} key={flow.taskID}>
                  <span>{flow.applicationTaskFlowUseCase}</span>
                  <div className="button_wrapper_flow_manager">
                    <IoClose
                      as={"button"}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExistingFlow(flow.applicationTaskFlowUseCase);
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <ErrorMessage>No Existing Flows !</ErrorMessage>
        )}
      </FlowManager>
      <InfoBox toggle={progress.state === "on" || undefined}>
        Press <span>ESC</span> to interact with the page
      </InfoBox>
      <PreviewBox toggle={toggleViewMode || undefined}>
        <span>
          <GoPrimitiveDot /> viewing...
        </span>
        <button onClick={() => stopFlowView()}>
          <GoX />
        </button>
      </PreviewBox>
      <Feedback toggle={toggleFeedback}>
        {feedback.isLoading ? (
          <ReactLoading
            type="spinningBubbles"
            height={50}
            width={50}
            color="black"
          />
        ) : feedback.data.length > 0 ? (
          <ul>
            {feedback.data[0].feedBackQuestions.map(
              (
                {
                  feedBackQuestion,
                  feedBackQuestionOptions,
                  feedBackQuestionType,
                },
                index
              ) => {
                return (
                  <li key={index}>
                    <p>
                      Question {index + 1} <span>{feedBackQuestion}</span>{" "}
                    </p>
                    <ul>
                      {feedBackQuestionOptions.map(({ image, text }, index) => {
                        return (
                          <li key={index}>
                            {" "}
                            <input
                              data-value={text}
                              type={
                                feedBackQuestionType === "radio-button"
                                  ? "radio"
                                  : "checkbox"
                              }
                            />{" "}
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
            )}
            <ButtonWrapper>
              <Button onClick={() => setToggleFeddback(false)}>Cancel</Button>
              <Button primary>Send</Button>
            </ButtonWrapper>
          </ul>
        ) : (
          <ErrorMessage>No Data Available !</ErrorMessage>
        )}
      </Feedback>
      {/* <Annoucement
        toggle={toggleAnnouncement}
        setToggle={setToggleAnnouncement}
      /> */}
    </>
  );
}

export default Foreground;
