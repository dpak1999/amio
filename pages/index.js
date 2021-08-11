/** @format */

import React, { useEffect } from "react";

const Index = ({ user, userFollowerStats }) => {
  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  return <div>Homepage</div>;
};

export default Index;
