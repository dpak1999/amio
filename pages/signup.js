/** @format */

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Message, Segment } from "semantic-ui-react";
import ImageContainer from "../components/common/ImageContainer";
import Inputs from "../components/common/Inputs";
import {
  FooterMessage,
  HeaderMessage,
} from "../components/common/WelcomeMessage";
import { registerUser } from "../utils/authUser";
import baseUrl from "../utils/baseUrl";
import uploadPic from "../utils/uploadPicToCloudinary";

const Signup = () => {
  let cancel;
  const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
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
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  const { name, email, password, bio } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }
    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMessage("Error uploading Image");
    }

    await registerUser(user, profilePicUrl, setErrorMessage);
    setFormLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      return setMediaPreview(URL.createObjectURL(files[0]));
    }
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const cancelToken = axios.CancelToken;
      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new cancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      
      if (res.data === "Username Available") {
        if (errorMessage !== null) setErrorMessage(null);
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (error) {
      setErrorMessage("Username not available");
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every((item) =>
      Boolean(item)
    );

    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

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
          <ImageContainer
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />

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

          <Form.Input
            label="Username"
            placeholder="Enter your username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (regexUserName.test(e.target.value)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
            loading={usernameLoading}
            error={!usernameAvailable}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            required
          />

          <Inputs
            user={user}
            showSocialLinks={socialLinks}
            setShowSocialLinks={setSocialLinks}
            handleChange={handleChange}
          />

          <Divider hidden />

          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default Signup;
