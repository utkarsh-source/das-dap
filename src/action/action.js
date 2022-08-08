import axios from "../../axios";
import React from "react";
import {
  ANNOUNCEMENT_BY_USER_FAIL,
  ANNOUNCEMENT_BY_USER_REQUEST,
  ANNOUNCEMENT_BY_USER_SUCCESS,
  CREATE__FLOW__FAIL,
  CREATE__FLOW__REQUEST,
  CREATE__FLOW__SUCCESS,
  DELETE__FLOW__FAIL,
  DELETE__FLOW__REQUEST,
  DELETE__FLOW__SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  TOKEN__FAIL,
  TOKEN__REQUEST,
  TOKEN__SUCCESS,
  VIEW__FEEDBACK__FAIL,
  VIEW__FEEDBACK__REQUEST,
  VIEW__FEEDBACK__SUCCESS,
  VIEW__FLOWS__FAIL,
  VIEW__FLOWS__REQUEST,
  VIEW__FLOWS__SUCCESS,
} from "./actionType";
import { toast } from "react-hot-toast";
import { ToastBox, ToastMessage } from "../styled-component";
import { GoVerified, GoAleart, GoAlert } from "react-icons/go";
import { removeFocusTrapListener } from "../utils/trapFocus";

export const getSavedToken = (dispatch) => {
  dispatch({ type: TOKEN__REQUEST });
  chrome?.storage?.sync
    .get(["token", "auth", "typeOfUser", "databaseID"])
    .then((response) => {
      if (!response.token) {
        dispatch({ type: TOKEN__FAIL });
      } else {
        dispatch({
          type: TOKEN__SUCCESS,
          payload: {
            token: response.token,
            auth: response.auth,
            typeOfUser: response.typeOfUser,
            databaseID: response.databaseID,
          },
        });
      }
    });
};

export const createFlow = (
  dispatch,
  databaseID,
  token,
  toolTipData,
  setProgress
) => {
  dispatch({ type: CREATE__FLOW__REQUEST });
  axios
    .post(
      `/Extension/Dashboard/${databaseID}/Tasks/createTaskFlow`,
      toolTipData,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      const { data, status, Message } = response.data;
      if (status != 200) throw data;
      setProgress({ state: "off" });
      dispatch({ type: CREATE__FLOW__SUCCESS });
      toast(
        <ToastBox>
          <ToastMessage>
            <GoVerified style={{ color: "lightgreen" }} /> Task Flow Published!
          </ToastMessage>
        </ToastBox>
      );
    })
    .catch((err) => {
      dispatch({ type: CREATE__FLOW__FAIL });
      toast(
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      );
    });
};

export const deleteTaskFlow = (
  dispatch,
  databaseID,
  token,
  flowUseCaseName,
  flowDataRef
) => {
  dispatch({ type: DELETE__FLOW__REQUEST });
  axios
    .delete(
      `Extension/Dashboard/${databaseID}/Tasks/deleteTaskFlow/${flowUseCaseName}/`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      const { data, status, Message } = response.data;
      if (status != 200) throw data;
      dispatch({ type: DELETE__FLOW__SUCCESS });
      viewFlows(dispatch, databaseID, token, flowDataRef);
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoVerified style={{ color: "lightgreen" }} /> Deleted !
          </ToastMessage>
        </ToastBox>
      ));
    })
    .catch((err) => {
      dispatch({ type: DELETE__FLOW__FAIL });
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      ));
    });
};

export const viewFlows = (dispatch, databaseID, token, flowDataRef) => {
  dispatch({ type: VIEW__FLOWS__REQUEST });
  axios
    .get(`Extension/Dashboard/${databaseID}/Tasks/viewAllTaskFlow`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { taskFlows, status, data } = response.data;
      flowDataRef.current = taskFlows;
      if (status != 200) throw data;
      dispatch({ type: VIEW__FLOWS__SUCCESS, payload: taskFlows });
    })

    .catch((err) => {
      dispatch({ type: VIEW__FLOWS__FAIL });
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      ));
    });
};

export const getAnnoucementsByUser = (
  dispatch,
  databaseID,
  token,
  userName
) => {
  dispatch({ type: ANNOUNCEMENT_BY_USER_REQUEST });
  axios
    .get(
      `Extension/Dashboard/${databaseID}/Announcement/viewAnnouncementByUser/${
        userName || "utkarsh"
      }`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((response) => {
      const { announcement, status, data } = response.data;
      if (status != 200) throw data;
      dispatch({ type: ANNOUNCEMENT_BY_USER_SUCCESS, payload: announcement });
    })

    .catch((err) => {
      dispatch({ type: ANNOUNCEMENT_BY_USER_FAIL });
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      ));
    });
};

export const viewFeedback = (dispatch, databaseID, token) => {
  dispatch({ type: VIEW__FEEDBACK__REQUEST });
  axios
    .get(`Extension/Dashboard/${databaseID}/FeedBack/viewFeedBack`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { FeedBackQuestions, status } = response.data;
      if (status != 200) throw data;
      dispatch({ type: VIEW__FEEDBACK__SUCCESS, payload: FeedBackQuestions });
    })

    .catch((err) => {
      dispatch({ type: VIEW__FEEDBACK__FAIL });
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      ));
    });
};

export const login = (dispatch, databaseID, formData, loginElement) => {
  dispatch({ type: LOGIN_REQUEST });
  axios
    .post(`/Auth/${databaseID}/Login`, formData)
    .then((response) => {
      const {
        databaseID,
        auth,
        typeOfUser,
        data,
        status,
        token = null,
      } = response.data;
      if (status != 200) throw data;
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { auth, token, typeOfUser, databaseID },
      });
      chrome?.storage?.sync.set({ token, auth, typeOfUser, databaseID });
      removeFocusTrapListener(loginElement);
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoVerified style={{ color: "lightgreen" }} /> Logged in!
          </ToastMessage>
        </ToastBox>
      ));
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAIL });
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      ));
    });
};

export const logout = (dispatch, databaseID, token) => {
  dispatch({ type: LOGOUT_REQUEST });
  axios
    .get(`Extension/Dashboard/${databaseID}/Logout`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { auth, data, token, status } = response.data;
      if (status != 200) throw data;
      dispatch({ type: LOGOUT_SUCCESS, payload: { auth, token } });
      chrome?.storage?.sync.clear();
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoVerified style={{ color: "lightgreen" }} /> Logged Out !
          </ToastMessage>
        </ToastBox>
      ));
    })
    .catch((err) => {
      dispatch({ type: LOGOUT_FAIL });
      toast((tst) => (
        <ToastBox>
          <ToastMessage>
            <GoAlert />{" "}
            {err.message || err.response.message || "Something went wrong!"}
          </ToastMessage>
        </ToastBox>
      ));
    });
};
