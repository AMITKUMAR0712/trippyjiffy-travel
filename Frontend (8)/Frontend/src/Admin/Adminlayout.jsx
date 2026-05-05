import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../HomeCompontent/ScrollToTop";

const Adminlayout = () => {
  return (
    <div>
      <ScrollToTop />
      <Outlet />
    </div>
  );
};


export default Adminlayout;
