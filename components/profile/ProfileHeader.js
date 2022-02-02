/** @format */

import React, { useState } from 'react';
import {
  Divider,
  Grid,
  Header,
  List,
  Segment,
  Image,
  Button,
} from 'semantic-ui-react';
import { followUser, unfollowUser } from '../../utils/profileActions';

const ProfileHeader = ({
  profile,
  ownAccount,
  loggedInUserFollowStats,
  setLoggedInUserFollowStats,
}) => {
  const [loading, setLoading] = useState(false);

  const isFollowing =
    loggedInUserFollowStats.following.length > 0 &&
    loggedInUserFollowStats.following.filter(
      (following) => following.user === profile.user._id
    ).length > 0;

  return (
    <Segment>
      <Grid stackable>
        <Grid.Column width={11}>
          <Grid.Row>
            <Header
              as={'h2'}
              content={profile.user.name}
              style={{ marginTop: '5px' }}
            />
          </Grid.Row>
          <Grid.Row stretched>
            {profile.bio}
            <Divider hidden />
          </Grid.Row>
          <Grid.Row>
            {profile.social ? (
              <>
                <List>
                  <List.Item>
                    <List.Icon name="mail" />
                    <List.Content content={profile.user.email} />
                  </List.Item>

                  {profile.social.facebook && (
                    <List.Item>
                      <List.Icon name="facebook" color="blue" />
                      <List.Content
                        content={profile.social.facebook}
                        style={{ color: 'blue' }}
                      />
                    </List.Item>
                  )}

                  {profile.social.instagram && (
                    <List.Item>
                      <List.Icon name="instagram" color="blue" />
                      <List.Content
                        content={profile.social.instagram}
                        style={{ color: 'blue' }}
                      />
                    </List.Item>
                  )}

                  {profile.social.youtube && (
                    <List.Item>
                      <List.Icon name="youtube" color="blue" />
                      <List.Content
                        content={profile.social.youtube}
                        style={{ color: 'red' }}
                      />
                    </List.Item>
                  )}

                  {profile.social.twitter && (
                    <List.Item>
                      <List.Icon name="twitter" color="blue" />
                      <List.Content
                        content={profile.social.twitter}
                        style={{ color: 'blue' }}
                      />
                    </List.Item>
                  )}
                </List>
              </>
            ) : (
              <>No Social media links</>
            )}
            <Divider hidden />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column stretched width={5} style={{ textAlign: 'center' }}>
          <Grid.Row>
            <Image
              src={profile.user.profilePicUrl}
              avatar
              size="large"
              alt=""
            />
          </Grid.Row>
          <br />
          {!ownAccount && (
            <Button
              compact
              loading={loading}
              disabled={loading}
              content={isFollowing ? 'Following' : 'Follow'}
              icon={isFollowing ? 'check circle' : 'add user'}
              color={isFollowing ? 'instagram' : 'twitter'}
              onClick={async () => {
                setLoading(true);
                isFollowing
                  ? await unfollowUser(
                      profile.user._id,
                      setLoggedInUserFollowStats
                    )
                  : await followUser(
                      profile.user._id,
                      setLoggedInUserFollowStats
                    );
                setLoading(false);
              }}
            />
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ProfileHeader;
