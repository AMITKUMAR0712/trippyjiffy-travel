// src/components/Dashboard/Content.jsx
import React from "react";
import Profile from "../Dashboard/Profile";

const Content = ({ activeMenu }) => {
  return (
    <main className="dashboard-content">
      {activeMenu === "profile" && <Profile />}
    </main>
  );
};

export default Content;
