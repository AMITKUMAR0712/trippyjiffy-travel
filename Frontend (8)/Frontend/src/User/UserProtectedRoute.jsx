import { Navigate, Outlet } from "react-router-dom";
import ScrollToTop from "../HomeCompontent/ScrollToTop";

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ScrollToTop />
      {children ? children : <Outlet />}
    </>
  );
};

export default UserProtectedRoute;

