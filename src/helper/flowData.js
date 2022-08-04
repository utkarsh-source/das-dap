export const getFlowData = (data, flowName, applicationName) => {
  let taskList = [];

  for (let key in data[flowName]) {
    taskList.push({
      stepNumber: +key.slice(-1),
      title: data[flowName][key].title,
      taskMessage: data[flowName][key].message,
      htmlTag: data[flowName][key].targetElement.tagName,
      cssSelector: data[flowName][key].targetElement.cssSelector,
      targetURL: data[flowName][key].targetUrl,
      customURL: data[flowName][key].customUrl
        ? data[flowName][key].customUrl
        : data[flowName][key].targetUrl,
      targetClickOffsetX: data[flowName][key].targetClickOffsetX,
      targetClickOffsetY: data[flowName][key].targetClickOffsetY,
    });
  }

  const tooltipdata = {
    applicationName: applicationName,
    applicationURL: window.location.href.split("/")[2],
    applicationTaskFlowUseCase: flowName.replace(/\s/g, "_"),
    taskList,
  };

  return tooltipdata;
};
