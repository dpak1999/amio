/** @format */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NoPosts, NoProfile } from '../components/Layout/NoData';
import baseUrl from '../utils/baseUrl';
import { Grid } from 'semantic-ui-react';
import ProfileMenuTabs from '../components/profile/ProfileMenuTabs';
import ProfileHeader from '../components/profile/ProfileHeader';
import { PlaceHolderPosts } from '../components/Layout/PlaceHolderGroup';
import PostCard from '../components/post/PostCard';
import { PostDeleteToastr } from '../components/Layout/Toastr';

const ProfilePage = ({
  profile,
  followersLength,
  followingLength,
  errorLoading,
  user,
  userFollowerStats,
}) => {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState('profile');
  const [showToaster, setShowToaster] = useState(false);
  const [loggedInUserFollowStats, setLoggedInUserFollowStats] =
    useState(userFollowerStats);

  const ownAccount = profile.user._id === user._id;

  const handleItemClick = (item) => setActiveItem(item);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { username } = router.query;
        const token = Cookies.get('token');

        const res = await axios.get(
          `${baseUrl}/api/profile/posts/${username}`,
          {
            headers: { Authorization: token },
          }
        );

        setPosts(res.data);
      } catch (error) {
        alert('Error loading posts');
      }
      setLoading(false);
    };

    getPosts();
  }, [router.query]);

  useEffect(() => {
    showToaster && setTimeout(() => setShowToaster(false), 3000);
  }, [showToaster]);

  if (errorLoading) {
    return <NoProfile />;
  }

  return (
    <>
      {showToaster && <PostDeleteToastr />}
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedInUserFollowStats={loggedInUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {activeItem === 'profile' && (
              <>
                <ProfileHeader
                  profile={profile}
                  ownAccount={ownAccount}
                  loggedInUserFollowStats={loggedInUserFollowStats}
                  setLoggedInUserFollowStats={setLoggedInUserFollowStats}
                />

                {loading ? (
                  <PlaceHolderPosts />
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      user={user}
                      post={post}
                      setPosts={setPosts}
                      setShowToastr={setShowToaster}
                    />
                  ))
                ) : (
                  <NoPosts />
                )}
              </>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token },
    });
    const { profile, followersLength, followingLength } = res.data;

    return { profile, followersLength, followingLength };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default ProfilePage;
