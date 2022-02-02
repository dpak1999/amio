/** @format */

import axios from 'axios';
import cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Button, Image, List } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import { followUser, unfollowUser } from '../../utils/profileActions';
import { NoFollowData } from '../Layout/NoData';
import Spinner from '../Layout/Spinner';

const Following = ({
  user,
  loggedInUserFollowStats,
  setLoggedInUserFollowStats,
  profileUserId,
}) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/following/${profileUserId}`,
          { headers: { Authorization: cookie.get('token') } }
        );

        setFollowing(res.data);
      } catch (error) {
        alert('Error loading followers');
      }
      setLoading(false);
    };

    getFollowing();
  }, [profileUserId]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : following.length > 0 ? (
        following.map((profileFollowing) => {
          console.log('profileFollowing', profileFollowing);

          const isFollowing =
            loggedInUserFollowStats.following.length > 0 &&
            loggedInUserFollowStats.following.filter(
              (following) => following.user === profileFollowing.user._id
            ).length > 0;

          return (
            <>
              <List
                key={profileFollowing.user._id}
                divided
                verticalAlign="middle"
              >
                <List.Item>
                  <List.Content floated="right">
                    {profileFollowing.user._id !== user._id && (
                      <Button
                        color={isFollowing ? 'instagram' : 'twitter'}
                        content={isFollowing ? 'Following' : 'Follow'}
                        icon={isFollowing ? 'check' : 'add user'}
                        disabled={followLoading}
                        onClick={async () => {
                          setFollowLoading(true);
                          isFollowing
                            ? await unfollowUser(
                                profileFollowing.user._id,
                                setLoggedInUserFollowStats
                              )
                            : await followUser(
                                profileFollowing.user._id,
                                setLoggedInUserFollowStats
                              );
                          setFollowLoading(false);
                        }}
                      />
                    )}
                  </List.Content>
                  <Image
                    avatar
                    src={profileFollowing.user.profilePicUrl}
                    alt=""
                  />
                  <List.Content
                    as={'a'}
                    href={`/${profileFollowing.user.username}`}
                  >
                    {profileFollowing.user.name}
                  </List.Content>
                </List.Item>
              </List>
            </>
          );
        })
      ) : (
        <NoFollowData followingComponent={true} />
      )}
    </>
  );
};

export default Following;
