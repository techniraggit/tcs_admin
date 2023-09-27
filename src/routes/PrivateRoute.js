import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../apis/adminApis";

function PrivateRoute() {
  return (
    isLoggedIn() ? <Outlet /> : <Navigate to='/' />
  )
}

export default PrivateRoute;
