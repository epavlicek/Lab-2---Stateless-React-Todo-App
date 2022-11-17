import React, { useEffect, useContext } from "react";
import { useResource } from "react-request-hook";
import { useParams, useNavigate } from "react-router-dom";

import { StateContext } from "../contexts";

import Post from "../post/Post";

export default function PostPage() {
  const { id } = useParams();
  const { state, dispatch } = useContext(StateContext);

  const navigate = useNavigate();

  const [post, getPost] = useResource(() => ({
    url: `/post/${id}`,
    method: "get",
    headers: { Authorization: `${state.user.access_token}` },
  }));
  useEffect(getPost, [id]);

  useEffect(() => {
    navigate(`/post/${post.data._id}`);
  }, [post]);

  return (
    <div>
      {post && post.data ? <Post {...post.data} /> : "Loading..."}
      <hr />
    </div>
  );
}
