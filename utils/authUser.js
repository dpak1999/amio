/** @format */
import Router from "next/router";
import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export const registerUser = async (user, profilePicUrl, setError) => {
  try {
    const res = await axios.post(`${baseUrl}/api/signup`, {
      user,
      profilePicUrl,
    });

    setToken(res.data);
  } catch (error) {
    const errorMessage = catchErrors(error);
    setError(errorMessage);
  }
};

export const loginUser = async (user, setError, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(`${baseUrl}/api/auth`, {
      user,
    });

    setToken(res.data);
  } catch (error) {
    const errorMessage = catchErrors(error);
    setError(errorMessage);
  }
};

const setToken = (token) => {
  cookie.set("token", token);
  Router.push("/");
};
