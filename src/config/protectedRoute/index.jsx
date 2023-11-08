import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ProtectRoute = ({ localUser }) => {
  console.log(localUser,"local user");
  if (!localUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectRoute;
