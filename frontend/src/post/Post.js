import React, { useContext, useEffect, useState } from "react";
import { useResource } from "react-request-hook";
import { Card, Button } from "react-bootstrap";
//import { Link } from "react-navi";
import { Link } from "react-router-dom";
import { StateContext } from "../contexts";

function Post({
  id,
  title,
  description,
  content,
  _id,
  dateCreated,
  complete,
  dateCompleted,
  author,
  short = false,
  disable = false,
}) {
  const { state, dispatch } = useContext(StateContext);
  const { user } = state;
  const [updateFailed, setUpdateFailed] = useState(false);

  const datef = new Intl.DateTimeFormat("en-US", {
    year: "numeric", //formating year
    month: "2-digit", //formating month
    day: "2-digit", //formating date
  });

  const [post, deletePost] = useResource((postId) => ({
    url: "/post",
    method: "delete",
    data: { id: postId, author },
    headers: { Authorization: `${user.access_token}` },
  }));

  const [updatePost, togglePost] = useResource(
    ({ complete, dateCompleted }) => ({
      url: "/post",
      method: "patch",
      data: { id, complete, dateCompleted, author },
      headers: { Authorization: `${user.access_token}` },
    })
  );

  useEffect(() => {
    if (post && (post.data || post.error) && post.isLoading === false) {
      if (post.error) {
        setUpdateFailed(true);
      } else {
        setUpdateFailed(false);
        dispatch({ type: "DELETE_POST", id: post.data.id });
      }
    }
  }, [post]);

  useEffect(() => {
    if (
      updatePost &&
      (updatePost.data || updatePost.error) &&
      updatePost.isLoading === false
    ) {
      if (updatePost.error) {
        setUpdateFailed(true);
      } else {
        setUpdateFailed(false);
        dispatch({
          type: "TOGGLE_POST",
          complete: updatePost.data.complete,
          dateCompleted: updatePost.data.dateCompleted,
          id,
        });
      }
    }
  }, [updatePost]);

  const checkBox = (evt) => {
    let tempDate = null;
    if (evt.target.checked) {
      tempDate = Date.now();
    } else {
      tempDate = null;
    }
    togglePost({ complete: evt.target.checked, dateCompleted: tempDate });
  };

  const deletedPost = () => {
    deletePost(id);
  };

  let processedContent = description;

  return (
    <div>
      <Link to={`/post/${_id}`}>
        <h3 style={{ color: "black" }}>{title}</h3>
      </Link>

      <div>{content}</div>
      <br />
      <i>
        Written by <b>{author}</b>
      </i>
      <input type="checkbox" checked={complete} onChange={checkBox} />
      <Button variant="link" disabled={disable} onClick={deletedPost}>
        Delete Todo
      </Button>
    </div>
  );
}

export default Post;
