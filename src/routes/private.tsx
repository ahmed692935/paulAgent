// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { JSX } from "react";
import Layout from "../layout/Layout";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // return children;
  return <Layout>{children}</Layout>;
};

export default PrivateRoute;
