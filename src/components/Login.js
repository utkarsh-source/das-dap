import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../../AppContext";
import { login } from "../action/action";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  Button,
  ButtonWrapper,
  FormBox,
  FormContainer,
  FormHeading,
  Icon,
  Input,
  InputBox,
  LabeledInput,
  PopupWrapper,
  Ruler,
} from "../styled-component";
import { removeFocusTrapListener, trapFocus } from "../utils/trapFocus";
import loginBannerImage from "../assets/loginBannerImage.svg";

function Login() {
  const [input, setInput] = useState("");
  const [password, setPass] = useState("");

  const { dispatch } = useContext(AppContext);

  const loginRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    chrome?.storage?.sync.set({ tabInfo: { url: window.location.href } });
    const full_domain = input.split("@")[1].split(".");
    const full_domain_length = full_domain.length;
    const main_domain = full_domain[full_domain_length - 2];
    login(dispatch, main_domain, { email: input, password }, loginRef.current);
  };

  const handleClose = () => {
    let port = chrome?.runtime.connect({ name: "content_script" });
    port.postMessage({ type: "unloadExtension" });
    window.location.reload();
  };

  useEffect(() => {
    trapFocus(loginRef.current);
  }, []);

  return (
    <PopupWrapper toggle={true}>
      <FormContainer toggle={true}>
        <figure>
          <img src={loginBannerImage} alt="login" />
        </figure>

        <FormBox ref={loginRef} onSubmit={handleSubmit}>
          <FormHeading>Sign In</FormHeading>
          <LabeledInput>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Email"
              name="email"
              type="email"
              required
            ></Input>
            <MdEmail />
          </LabeledInput>
          <LabeledInput>
            <Input
              value={password}
              onChange={(e) => setPass(e.target.value)}
              name="password"
              type="password"
              placeholder="Password"
              required
            ></Input>
            <RiLockPasswordLine />
          </LabeledInput>
          <ButtonWrapper>
            <Button type="button" onClick={handleClose}>
              Close
            </Button>
            <Button primary type="submit">
              Login
            </Button>
          </ButtonWrapper>
        </FormBox>
      </FormContainer>
    </PopupWrapper>
  );
}

export default Login;
