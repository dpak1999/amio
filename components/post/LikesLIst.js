/** @format */

import { useState } from "react";
import { Image, List, Popup } from "semantic-ui-react";
import Link from "next/link";
import catchErrors from "../../utils/catchErrors";
import { LikesPlaceHolder } from "../Layout/PlaceHolderGroup";
import { Axios } from "../../utils/postActions";

const LikesLIst = ({ postId, trigger }) => {
  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLikesList = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(`/like/${postId}`);
      setLikesList(res.data);
      setLoading(false);
    } catch (error) {
      alert(catchErrors(error));
    }
  };

  return (
    <Popup
      on="click"
      onClose={() => setLikesList([])}
      onOpen={() => getLikesList()}
      popperDependencies={[likesList]}
      trigger={trigger}
      wide
    >
      {loading ? (
        <LikesPlaceHolder />
      ) : (
        <>
          {likesList.length > 0 && (
            <div
              style={{
                overflow: "auto",
                maxHeight: "15rem",
                height: "15rem",
                minWidth: "210px",
              }}
            >
              {console.log(likesList)}
              <List selection size="large">
                {likesList &&
                  likesList.map((like) => (
                    <List.Item key={like.id}>
                      <Image avatar src={like.user.profilePicUrl} />

                      <List.Content>
                        <Link href={`/${like.user.username}`}>
                          <List.Header as="a" content={like.user.name} />
                        </Link>
                      </List.Content>
                    </List.Item>
                  ))}
              </List>
            </div>
          )}
        </>
      )}
    </Popup>
  );
};

export default LikesLIst;
