import { useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useResource } from "react-request-hook";
import { StateContext } from "../contexts";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);

  const { state, dispatch } = useContext(StateContext);
  const { user } = state;

  const [post, createPost] = useResource(({ title, content, author }) => ({
    url: "/post",
    method: "post",
    data: { title, content, author },
    headers: { Authorization: `${state.user.access_token}` },
    data: { title, content },
  }));
  useEffect(() => {
    if (post?.isLoading === false && post?.data) {
      dispatch({
        type: "CREATE_POST",
        title: post.data.title,
        content: post.data.content,
        author: post.data.username,
        id: post.data.id,
        dateCreated: post.data.dateCreated,
        complete: post.data.complete,
        dateCompleted: post.data.dateCompleted,
      });
    }
  }, [post]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost({ title, content, author: user });
      }}
    >
      <div>
        Author: <b>{user.username}</b>
      </div>
      <div>
        date: <b>{Date.now()}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title:</label>
        <input
          type="text"
          name="create-title"
          id="create-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <input type="submit" value="Add to List" />
    </form>
  );
}
