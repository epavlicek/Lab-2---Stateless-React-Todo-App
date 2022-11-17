import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import UserBar from "../user/UserBar";
import Header from "../Header";
import { StateContext } from "../contexts";

export default function Layout() {
  const { state } = useContext(StateContext);
  const { user } = state;

  return (
    <>
      <Header text="My Blog" />
      <React.Suspense fallback={"Loading..."}>
        <UserBar />
      </React.Suspense>{" "}
      <br />
      {user && <Link to="/post/create">Create New Post</Link>}
      <Outlet />
    </>
  );
}
