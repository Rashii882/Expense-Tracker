import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import {
  APIUrl,
  handleError,
  handleSuccess,
} from "../utils";

function Login() {

  const [loginInfo, setLoginInfo] =
    useState({
      email: "",
      password: "",
    });

  const navigate = useNavigate();

  const handleChange = (e) => {

    const { name, value } = e.target;

    const copyLoginInfo = {
      ...loginInfo,
    };

    copyLoginInfo[name] = value;

    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    console.log("Login Clicked");

    const { email, password } =
      loginInfo;

    if (!email || !password) {

      return handleError(
        "Email and Password are required"
      );
    }

    try {

      const url =
        `${APIUrl}/auth/login`;

      const response = await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            loginInfo
          ),
        }
      );

      const result =
        await response.json();
          console.log(result);

      const {
        success,
        message,
        jwtToken,
        name,
        error,
      } = result;

      if (success) {

        handleSuccess(message);

        localStorage.setItem(
          "token",
          jwtToken
        );

        localStorage.setItem(
          "loggedInUser",
          name
        );

        setTimeout(() => {

          navigate("/home");

        }, 1000);

      } else if (error) {

        const details =
          error?.details[0].message;

        handleError(details);

      } else if (!success) {

        handleError(message);
      }

    } catch (err) {

      handleError(err);
    }
  };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Login
        </h1>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div>

            <label>
              Email
            </label>

            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label>
              Password
            </label>

            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
            />

          </div>

          <button type="submit">
            Login
          </button>

          <span>
            Don't have an account ?

            <Link to="/signup">
              Signup
            </Link>
          </span>

        </form>

        <ToastContainer />

      </div>

    </div>
  );
}

export default Login;