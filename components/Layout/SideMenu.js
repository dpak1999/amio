/** @format */

import React from "react";
import { Icon, List } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logoutUser } from "../../utils/authUser";

const SideMenu = ({
  user: { unreadNotification, email, unreadMessages, username },
}) => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;

  return (
    <>
      <List
        style={{ paddingTop: "1rem" }}
        size="big"
        verticalAlign="middle"
        selection
      >
        <Link href="/">
          <List.Item active={isActive("/")}>
            <Icon name="home" size="large" {...(isActive("/") && { color: "teal" })} />
            <List.Content>
              <List.Header content="Home" />
            </List.Content>
          </List.Item>
        </Link>

        <br />

        <Link href="/messages">
          <List.Item active={isActive("/messages")}>
            <Icon
              name={unreadMessages ? "hand point right" : "mail outline"}
              size="large"
              {...(unreadMessages && { color: "orange" })}
            />
            <List.Content>
              <List.Header content="Messages" />
            </List.Content>
          </List.Item>
        </Link>

        <br />

        <Link href="/notifications">
          <List.Item active={isActive("/notifications")}>
            <Icon
              name={unreadNotification ? "hand point right" : "bell outline"}
              size="large"
              {...((isActive("/notifications") && { color: "teal" }) ||
              (unreadNotification && { color: "orange" }))}
            />
            <List.Content>
              <List.Header content="Notifications" />
            </List.Content>
          </List.Item>
        </Link>

        <br />

        <Link href={`/${username}`}>
          <List.Item active={router.query.username === username}>
            <Icon
              name="user"
              size="large"
              {...(router.query.username === username && { color: "teal" })}
            />
            <List.Content>
              <List.Header content="Account" />
            </List.Content>
          </List.Item>
        </Link>

        <br />

        <List.Item onClick={() => logoutUser(email)}>
          <Icon name="log out" size="large" />
          <List.Content>
            <List.Header content="Logout" />
          </List.Content>
        </List.Item>
      </List>
    </>
  );
};

export default SideMenu;
