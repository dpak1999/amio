/** @format */

import React from "react";
import { Button, Divider, Form, Message, TextArea } from "semantic-ui-react";

const Inputs = ({
  user: { bio, facebook, youtube, twitter, instagram },
  handleChange,
  showSocialLinks,
  setShowSocialLinks,
}) => {
  return (
    <>
      <Form.Field
        label="Bio"
        required
        control={TextArea}
        name="bio"
        value={bio}
        onChange={handleChange}
        placeholder="Enter a short bio"
      />

      <Button
        content="Add social Links"
        color="red"
        icon="at"
        type="button"
        onClick={() => setShowSocialLinks(!showSocialLinks)}
      />

      {showSocialLinks && (
        <>
          <Divider />
          <Form.Input
            icon="facebook f"
            iconPosition="left"
            name="facebook"
            value={facebook}
            onChange={handleChange}
          />

          <Form.Input
            icon="twitter"
            iconPosition="left"
            name="twitter"
            value={twitter}
            onChange={handleChange}
          />

          <Form.Input
            icon="instagram"
            iconPosition="left"
            name="instagram"
            value={instagram}
            onChange={handleChange}
          />

          <Form.Input
            icon="youtube"
            iconPosition="left"
            name="youtube"
            value={youtube}
            onChange={handleChange}
          />

          <Message
            icon="attention"
            info
            size="small"
            header="Social media links are optional"
          />
        </>
      )}
    </>
  );
};

export default Inputs;
