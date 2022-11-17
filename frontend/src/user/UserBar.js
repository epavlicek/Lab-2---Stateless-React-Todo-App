import React, { useContext } from "react";
import { StateContext } from "../contexts";

import Login from "./Login";
//import Logout from "./Logout";

import Register from "./Register";
const Logout = React.lazy(() => import("./Logout"));

export default function UserBar() {
  const { state } = useContext(StateContext);
  if (state.user) {
    return <Logout />;
  } else {
    return (
      <>
        <Login />
        <Register />
      </>
    );
  }
}
