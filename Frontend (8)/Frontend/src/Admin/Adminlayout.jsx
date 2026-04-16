import React from "react";
import { Outlet } from "react-router-dom";

const Adminlayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Adminlayout;
