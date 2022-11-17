import React, { useState, useEffect, useReducer } from "react";
import { useResource } from "react-request-hook";
//import { v4 as uuidv4 } from "uuid";

//import UserBar from "./user/UserBar";
import PostList from "./post/PostList";
import CreatePost from "./post/CreatePost";
//import Header from "./Header";
//import ChangeTheme from "./ChangeTheme";
import appReducer from "./reducers";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";

import { ThemeContext, StateContext } from "./contexts";
function App() {
  const initialPosts = [];
  const [state, dispatch] = useReducer(appReducer, {
    user: "",
    posts: initialPosts,
  });
  const { user } = state;
  useEffect(() => {
    if (user) {
      document.title = `${user}’s Blog`;
    } else {
      document.title = "Blog";
    }
  }, [user]);
  const [theme, setTheme] = useState({
    primaryColor: "deepskyblue",
    secondaryColor: "coral",
  });
  return (
    <div>
      <StateContext.Provider value={{ state, dispatch }}>
        <ThemeContext.Provider value={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
              </Route>
              <Route path="/post" element={<Layout />}>
                <Route path="/post/create" element={<CreatePost />} />
                <Route path="/post/:id" element={<PostPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeContext.Provider>
      </StateContext.Provider>
    </div>
  );
}
export default App;
