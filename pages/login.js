/** @format */

import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Message, Segment } from "semantic-ui-react";
import cookie from "js-cookie";
import {
  FooterMessage,
  HeaderMessage,
} from "../components/common/WelcomeMessage";
import { loginUser } from "../utils/authUser";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { email, password } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(user, setErrorMessage, setFormLoading);
  };

  useEffect(() => {
    const isUser = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );

    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  useEffect(() => {
    document.title = "Welcome back";
    const userEmail = cookie.get("amio-userEmail");
    if (userEmail) {
      setUser((prev) => ({ ...prev, email: userEmail }));
    }
  }, []);

  return (
    <>
      <HeaderMessage />

      <Form
        loading={formLoading}
        error={errorMessage !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Uh! Oh something went wrong"
          content={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />

        <Segment>
          <Form.Input
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
            required
          />

          <Form.Input
            label="Password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />

          <Divider hidden />

          <Button
            icon="signup"
            content="Login"
            type="submit"
            color="orange"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  );
};

export default Login;
