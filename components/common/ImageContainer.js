/** @format */

import React from "react";
import { Form, Header, Icon, Image, Segment } from "semantic-ui-react";

const ImageContainer = ({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
}) => {
  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setHighlighted(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setHighlighted(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setHighlighted(true);
              const droppedFile = Array.from(e.dataTransfer.files);
              setMedia(droppedFile[0]);
              setMediaPreview(URL.createObjectURL(droppedFile[0]));
            }}
          >
            {mediaPreview === null ? (
              <>
                <Segment
                  {...(highlighted ? { color: "green" } : {})}
                  placeholder
                  basic
                >
                  <Header icon>
                    <Icon
                      name="file image outline"
                      style={{ cursor: "pointer" }}
                      onClick={() => inputRef.current.click()}
                    />
                    Drag an Image or Click to upload an Image
                  </Header>
                </Segment>
              </>
            ) : (
              <>
                <Segment color="green" placeholder basic>
                  <Image
                    src={mediaPreview}
                    size="medium"
                    centered
                    style={{ cursor: "pointer" }}
                    onClick={() => inputRef.current.click()}
                  />
                </Segment>
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
};

export default ImageContainer;
