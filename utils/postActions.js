/** @format */

import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/post`,
  headers: { Authorization: cookie.get("token") },
});

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPosts,
  setNewpost,
  setError
) => {
  try {
    const res = await Axios.post("/", { text, location, picUrl });

    setPosts((prev) => [res.data, ...prev]);
    setNewpost({ text: "", location: "" });
  } catch (error) {
    const errMessage = catchErrors(error);
    setError(errMessage);
  }
};

export const deletePost = async (postId, setPosts, setShowToastr) => {
  try {
    await Axios.delete(`/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setShowToastr(true);
  } catch (error) {
    console.error(error);
  }
};
