/** @format */

import React, { useState } from "react";
import { Form, Message, Segment } from "semantic-ui-react";
import { FooterMessage, HeaderMessage } from "../common/WelcomeMessage";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });

  const [socialLinks, setSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { name, email, password, bio } = user;

  const handleSubmit = (e) => {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

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
            label="Name"
            placeholder="Enter your name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            type="text"
            required
          />

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
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default Signup;
