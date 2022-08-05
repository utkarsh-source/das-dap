import styled from "styled-components";
import { theme } from "./theme";

export const PopupWrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${(props) => theme.lightBlack};
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
`;

export const FormContainer = styled.div`
  overflow: hidden;
  background-color: white;
  border: 1px solid rgba(red, 0.8);
  border-radius: 15px;
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 850px;
  min-height: 530px;
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: translate(-50%, -50%)
    ${(props) => (props.toggle ? "scale(100%)" : "scale(98%)")};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  transition: transform 0.05s ease-out, opacity 0.05s ease-out;
  column-gap: 10px;
  & > figure {
    position: relative;
    object-fit: contain;
    min-width: 380px;
    & > img {
      width: 100%;
      object-fit: contain;
    }
  }
`;

export const FormBox = styled.form`
  background-color: ${(props) => theme.lightGray};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 50px;
  width: 100%;
  align-self: stretch;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
`;

export const InputBox = styled.div`
  position: relative;
  display: flex;
  border-radius: 2px;
  overflow: hidden;
  align-items: center;
  height: ${(props) => props.height || "60px"};
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 15px;
  border: 1px solid ${(props) => theme.gray};
  background-color: white;
  color: black;
  & > input {
    background-color: transparent;
    color: inherit;
    width: 100%;
    height: 100%;
    font-size: 15px;
    &::placeholder {
      color: ${(props) => theme.gray};
      font-size: inherit;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  column-gap: 10px;
  margin-top: auto;
  width: 100% !important;
`;

export const Button = styled.button`
  position: relative;
  border-radius: 3px;
  font-weight: bold;
  background-color: ${(props) => (props.primary ? theme.waterBlue : "white")};
  color: ${(props) => (props.primary ? "white" : "black")};
  border: 1px solid ${(props) => (props.primary ? theme.waterBlue : "black")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 13px;
  font-size: 12px;
  flex-grow: 1;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:active {
    transform: scale(0.96);
  }
  cursor: pointer;
  & > svg {
    font-size: 12px;
    transform: scale(1.5);
    &:not(:only-child) {
      margin-right: 8px;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
`;

export const FormHeading = styled.h1`
  color: black;
  font-size: 25px;
  padding: 0 10px;
  padding-bottom: 15px;
  margin-bottom: 30px;
  text-transform: uppercase;
  border-bottom: 2px solid ${(props) => theme.lightBlack};
`;

export const Icon = styled.svg`
  color: ${(props) => theme.gray};
  font-size: 30px;
  margin-right: 10px;
`;

export const Ruler = styled.hr`
  height: 0.5px;
  border: none;
  border-top: 1px dashed ${(props) => theme.lightGray};
  width: 100%;
  /* background-color: rgba(0 0 0 / 0.1); */
  margin: 8px auto;
  margin-top: auto;
`;

export const Settings = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 80px;
  box-shadow: 0 0 15px rgba(0 0 0 / 0.15);
  padding: 5px 10px;
  justify-content: space-between;
  transform: ${(props) =>
    props.toggle ? "translateY(0)" : "translateY(100%)"};
  transition: transform 0.07s ease-out;
  background-color: white;
  column-gap: 25px;
`;

export const FlexBox = styled.div`
  display: flex;
  column-gap: 10px;
`;

export const InfoBox = styled.p`
  background-color: ${(props) => theme.gray};
  border-radius: 5px;
  padding: 10px 15px;
  color: white;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  & > span {
    display: inline-block;
    background-color: white;
    padding: 2px 5px;
    color: black;
    margin: 0 2px;
    border-radius: 2px;
  }
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transition: opacity 0.07s ease-out;
`;

export const FlowManager = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  max-width: 500px;
  background-color: white;
  padding: 5px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => theme.shadow};
  transform: ${(props) =>
    props.toggle ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.2s ease-out;
  & > ul {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: 0 10px 0 0;
    &::-webkit-scrollbar {
      width: 5px;
      &-thumb {
        background-color: ${(props) => theme.waterBlue};
        border-radius: 10px;
      }
      &-track {
        background-color: ${(props) => theme.extraLightGray};
      }
    }
    & > li {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      position: relative;
      border-radius: 2px;
      padding: 15px 10px;
      border: 1px solid ${(props) => theme.chalk};
      transition: transform 0.15s;
      background-color: white;
      cursor: pointer;
      &:hover {
        background-color: ${(props) => theme.extraLightGray};
        transform-origin: left;
        transform: scale(1.02);
      }
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      & .button_wrapper_flow_manager {
        display: flex;
        margin-left: auto;
        & > svg {
          font-size: 22px;
          color: ${(props) => theme.gray};
        }
      }
      & > span {
        font-size: 15px;
      }
    }
  }
`;

export const FilterIcon = styled.svg`
  background-color: ${(props) => theme.waterBlue};
  height: 50px;
  padding: 10px;
  width: 50px;
  color: white;
  border-radius: 3px;
  margin-top: 0;
`;

export const CloseButton = styled.svg`
  font-size: 20px;
  margin: 10px 0;
  margin-left: auto;
`;

export const CurrentFlowBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  border: 1px dashed ${(props) => theme.lightGray};
  & > p {
    margin-bottom: 10px;
    & > span {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      color: black;
      background-color: rgba(0 0 0 / 0.03);
      border-radius: 4px;
    }
  }
  & > button {
    background-color: ${(props) => theme.waterBlue};
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 0 5px 0 rgba(0 0 0 / 0.1);
    margin-left: auto;
    width: max-content;
  }
  margin: 15px 0;
`;

export const ErrorMessage = styled.p`
  background-color: white;
  border-radius: 5px;
  padding: 10px 15px;
  box-shadow: 0 0 8px 0 rgba(0 0 0 / 0.09);
  width: max-content;
  margin: 10px auto;
`;

export const Loader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: "10px";
  width: 100px;
  height: 100px;
  box-shadow: ${(props) => theme.shadow};
  display: grid;
  place-content: center;
  border-radius: 5px;
  & > div > svg {
    fill: ${(props) => theme.waterBlue};
  }
`;

export const Feedback = styled.div`
  position: fixed;
  bottom: 80px;
  right: 10px;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  transition: opacity 0.05s ease-out;
  & > ul {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 300px;
    position: absolute;
    top: -2px;
    right: 0;
    transform: translateY(-100%);
    background-color: white;
    box-shadow: ${(props) => theme.shadow};
    border-radius: 5px;
    padding: 20px;
    & > div[style] {
      display: inline-block;
      margin: auto;
    }
    & > li {
      border-radius: 5px;
      & > p {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        & > span {
          padding-top: 15px;
          font-weight: bold;
          font-size: 15px;
          padding-bottom: 15px;
        }
      }
      & > ul {
        display: flex;
        align-items: center;
        margin-left: 1px;
        & > li {
          display: flex;
          align-items: center;
          & > span {
            font-size: 14px;
            margin-left: 10px;
          }
          & > input {
            transform: scale(125%);
          }
          &:not(:last-child) {
            margin-right: 20px;
          }
        }
      }
    }
  }
`;

export const AnnouncementBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  background-color: white;
  border-radius: 10px;
  box-shadow: ${(props) => theme.shadow};
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  min-width: 350px;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: translate(-50%, -50%)
    ${(props) => (props.toggle ? "scale(100%)" : "scale(98%)")};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  transition: transform 0.05s ease-out, opacity 0.05s ease-out;
  & > .heading {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    border-bottom: 1px solid ${(props) => theme.lightBlack};
    padding-bottom: 10px;
    & > svg {
      font-size: 20px;
      margin-left: auto;
      cursor: pointer;
    }
  }
  & > ul {
    & > li {
      & > p {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        & > span {
          background-color: ${(props) => theme.waterBlue};
          padding: 2px 10px;
          color: white;
          font-size: 14px;
          border-radius: 10px;
          margin-right: 10px;
        }
        font-size: 16px;
      }
    }
  }
`;

export const Subject = styled.p`
  margin: 0 5px;
  font-size: 14px;
`;

export const From = styled.p`
  margin: 0 5px;
  font-weight: bold;
`;

export const AnnoucemnetBody = styled.p`
  font-size: 15px;
`;

export const ButtonRounded = styled(Button)`
  margin: 0;
  width: 20px;
  height: 20px;
  border-radius: 100px;
  margin-left: auto;
  padding: 1px;
  margin-bottom: 10px;
`;

export const Badge = styled.p`
  position: absolute;
  top: 0;
  left: 5px;
  width: 15px;
  height: 15px;
  transform: translateY(-50%);
  color: black;
  background-color: white;
  box-shadow: ${(props) => theme.shadow};
  border: 1px solid black;
  border-radius: 100%;
  font-weight: bold;
  display: grid;
  place-content: center;
  font-size: 11px;
`;

export const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  padding: 10px;
  position: fixed;
  min-width: 350px;
  filter: drop-shadow(0 0 50px rgba(0 0 0 / 0.2));
  pointer-events: auto;
  & > div {
    display: flex;
    align-items: center;
    & > input {
      font-size: 20px;
      color: gray;
      font-weight: bold;
    }
    & > svg {
      font-size: 25px;
      cursor: pointer;
      margin-left: auto;
    }
  }
  & > textarea {
    border: 1px dashed black;
    border-radius: 2px;
    padding: 5px;
    margin: 15px 0;
    font-size: 15px;
    min-height: 60px;
    resize: vertical;
  }
`;

export const Arrow = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 2px;
  background-color: white;
`;

export const PreviewTooltip = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  min-width: 350px;
  filter: drop-shadow(0 0 50px rgba(0 0 0 / 0.2));
  & > p {
    font-size: 20px;
    color: gray;
    font-weight: bold;
  }
  & > div > p {
    margin: 10px 0;
    font-size: 15px;
  }
`;

export const HoverHighlighter = styled.div`
  --padding: 3px;
  position: fixed;
  pointer-events: none;
  background-color: ${(props) => theme.lemonYellow};
  opacity: 0.7;
  border: 1px solid ${(props) => theme.lemonYellow};
  border-radius: 1px;
  padding: var(--padding);
  box-sizing: content-box !important;
  transform: translate(-3px, -3px);
`;

export const HighlighterTooltip = styled.div`
  position: fixed;
  pointer-events: none;
  background-color: black;
  padding: 10px;
  color: white;
  font-size: 14.5px;
  border-radius: 2px;
`;

export const ToastBox = styled.div`
  max-width: 400px;
  width: max-content;
  box-shadow: ${(props) => theme.shadow};
  & > div {
    display: flex;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    align-items: stretch;
    justify-content: space-between;
    background-color: white;
    overflow: hidden;
    border-left: 6px solid ${(props) => theme.waterBlue};
  }
`;

export const ToastMessage = styled.div`
  font-size: 16px;
  flex-grow: 1;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  & > svg {
    color: red;
    font-size: 25px;
    margin-right: 12px;
  }
  &[toggle] > svg {
    color: lightgreen !important;
  }
`;

export const ToastButtonBox = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.single ? "row" : "column")};
  align-items: stretch;
  margin-left: 20px;
  & > button {
    border: none;
    width: 50px;
    min-height: 50px;
    background-color: whitesmoke;
    cursor: pointer;
    & > svg {
      font-size: 20px;
      transition: transform 0.1s;
    }
    &:hover {
      & > svg {
        transform: scale(1.5);
      }
      &:active {
        transform: scale(1);
      }
    }
    &:first-child {
      background-color: ${(props) => theme.waterBlue};
      color: white;
    }
  }
`;

export const PreviewBox = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  column-gap: 5px;
  height: 40px;
  transition: opacity 0.07s linear, transform 0.07s ease-out;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: ${(props) =>
    props.toggle ? "translateY(0%)" : "translateY(-200%)"};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => theme.gray};
    font-size: 14px;
    color: white;
    border-radius: 5px;
    align-self: stretch;
    padding: 0 20px;
    border-radius: 4px;
    column-gap: 5px;
  }
  & > button {
    padding: 0 12px;
    display: inline-grid;
    place-content: center;
    background-color: ${(props) => theme.gray};
    color: white;
    border-radius: 4px;
    align-self: stretch;
    flex-grow: 1;
  }
`;

export const HelpLayer = styled.div`
  position: "fixed";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid red;
`;

export const Feature = styled.button`
  position: "relative";
  background-color: white;
  border: 1.5px dashed black;
  border-radius: 100%;
  width: 45px;
  height: 45px;
  display: grid;
  place-content: center;
  /* box-shadow: ${(props) => theme.shadow}; */
  cursor: pointer;
  & > svg {
    color: black;
    font-size: 20px;
  }
  & > span {
    position: absolute;
    display: inline-block;
    opacity: 0;
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    background-color: black;
    top: 0;
    left: 0;
    transform: translate(-50%, -100%);
  }
  &:hover {
    background-color: ${(props) => theme.waterBlue};
    border: 1px solid ${(props) => theme.waterBlue};
    & > svg {
      color: white;
    }
    & > span {
      opacity: 1;
    }
  }
`;

export const TooltipEditor = styled.div`
  background-color: white;
  border: 1px solid rgba(red, 0.8);
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 350px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: translate(-50%, -50%)
    ${(props) => (props.toggle ? "scale(100%)" : "scale(98%)")};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  transition: transform 0.05s ease-out, opacity 0.05s ease-out;
  & > .heading {
    display: flex;
    align-items: center;
    & > h1 {
      font-size: 20px;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
    }
    & > svg {
      font-size: 25px;
      margin-left: auto;
      cursor: pointer;
    }
  }
  & > .url {
    background-color: ${(props) => theme.extraLightGray};
    padding: 10px;
    border-radius: 3px;
    margin: 10px 0;
  }
  & > .matchInfo {
    font-size: 12px;
    font-weight: bold;
    text-align: right;
    margin-bottom: 20px;
    color: ${(props) => theme.waterBlue};
  }
  & > .instruction {
    background: white;
    display: flex;
    align-items: center;
    column-gap: 5px;
    margin: 10px 0;
    & > span {
      background-color: ${(props) => theme.dirtyBlue};
      color: white;
      border-radius: 3px;
      margin-right: 5px;
      display: inline-grid;
      place-content: center;
      width: 20px;
      height: 20px;
    }
  }
  & > div {
    display: flex;
    align-items: center;
    column-gap: 5px;
    span {
      border-radius: 3px;
      display: inline-block;
      background-color: ${(props) => theme.extraLightGray};
      padding: 10px;
    }
    input {
      border: 1px dashed ${(props) => theme.lightGray};
      border-radius: 5px;
      padding: 10px;
      margin: 10px 0;
      font-size: 16px;
      width: 100%;
    }
  }
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;
  margin: 0 10px;
  flex-grow: 1;
  overflow-x: auto;
  padding: 10px 0;
  & > div {
    display: flex;
    align-items: center;
    column-gap: 5px;
    &:first-child {
      margin-left: auto;
    }
    &:last-child {
      margin-right: auto;
    }
    & > svg {
      font-size: 20px;
    }
  }
  &::-webkit-scrollbar {
    height: 3px;
    &-thumb {
      background-color: ${(props) => theme.waterBlue};
      border-radius: 10px;
    }
    &-track {
      background-color: ${(props) => theme.extraLightGray};
    }
  }
`;

export const LabeledInput = styled.label`
  position: relative;
  display: flex;
  border-radius: 4px;
  align-items: center;
  height: ${(props) => props.height || "60px"};
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  padding: 0 15px;
  border: 1px solid ${(props) => theme.chalk};
  transition: box-shadow 0.07s;
  background-color: white;
  color: black;
  column-gap: 10px;
  box-shadow: 0 0 0.1px 0.1px ${(props) => theme.lightBlack};
  &:focus-within {
    box-shadow: 0 0 0.5px 2.2px ${(props) => theme.dirtyBlue} !important;
  }
  & > input::placeholder {
    color: black;
  }
  & > svg {
    fill: ${[(props) => theme.waterBlue]} !important;
    color: ${[(props) => theme.waterBlue]} !important;
    font-size: 25px;
    margin-left: 10px;
  }
`;
