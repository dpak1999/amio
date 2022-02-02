/** @format */

import axios from 'axios';
import cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Button, Image, List } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import { NoFollowData } from '../Layout/NoData';
import Spinner from '../Layout/Spinner';

const Followers = ({
  user,
  loggedInUserFollowStats,
  setUserFollowStats,
  profileUserId,
}) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/followers/${profileUserId}`,
          { headers: { Authorization: cookie.get('token') } }
        );

        setFollowers(res.data);
      } catch (error) {
        alert('Error loading followers');
      }
      setLoading(false);
    };

    getFollowers();
  }, [profileUserId]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : followers.length > 0 ? (
        followers.map((profileFollower) => {
          const isFollowing =
            loggedInUserFollowStats.following.length > 0 &&
            loggedInUserFollowStats.following.filter(
              (following) => following.user === profileFollower.user._id
            ).length > 0;

          return (
            <>
              <List
                key={profileFollower.user._id}
                divided
                verticalAlign="middle"
              >
                <List.Item>
                  <List.Content floated="right">
                    {profileFollower.user._id !== user._id && (
                      <Button
                        color={isFollowing ? 'instagram' : 'twitter'}
                        content={isFollowing ? 'Following' : 'Follow'}
                        icon={isFollowing ? 'check' : 'add user'}
                        disabled={followLoading}
                      />
                    )}
                  </List.Content>
                  <Image
                    avatar
                    src={profileFollower.user.profilePicUrl}
                    alt=""
                  />
                  <List.Content
                    as={'a'}
                    href={`/${profileFollower.user.username}`}
                  >
                    {profileFollower.user.name}
                  </List.Content>
                </List.Item>
              </List>
            </>
          );
        })
      ) : (
        <NoFollowData followersComponent={true} />
      )}
    </>
  );
};

export default Followers;
