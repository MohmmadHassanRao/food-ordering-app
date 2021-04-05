import React from "react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import url from "../../url";
import {
  useGlobalState,
  useSetGlobalState,
} from "../../globalState/GlobalState";
import cookie from "react-cookie";
import { Button, Card, Form } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import { json } from "body-parser";
import { signedCookies } from "cookie-parser";
axios.defaults.withCredentials = true;

const Login = () => {
  // const url = "http://localhost:5000";
  // const url = "https://food-mania.herokuapp.com";

  const history = useHistory();
  const globalState = useGlobalState();
  const setGlobalState = useSetGlobalState();

  // console.log(globalState);

  let email = useRef();
  console.log(email);
  let password = useRef();
  //   let validation = useRef();
  //   console.log(validation.current);

  let [validateEmail, setValidateEmail] = useState("");
  const login = () => {
    // console.log(name, email, password);

    axios({
      method: "post",
      url: url + "/auth/login",
      data: {
        email: email.current.value,
        password: password.current.value,
      },
    }).then(
      (response) => {
        console.log("response", response);
        // console.log("role", response.data.user.role);
        alert(response.data.message);
        if (response.data.status === 200) {
          history.push("/dashboard");
          setGlobalState((prevState) => ({
            ...prevState,
            // user: response.data.user,
            isLoggedIn: !prevState.isLoggedIn,
            role: response.data.user.role,
          }));
        }
      },
      (error) => {
        alert("error", error);
        console.log("error data", JSON.stringify(error.message));
      }
    );
  };
  useEffect(() => {
    console.log(validateEmail);

    axios({
      method: "post",
      url: `${url}/auth/validateEmail`,
      data: {
        email: validateEmail,
      },
    })
      .then((res) => {
        console.log("validation", res.data.isFound);
        console.log("validation", res.data.data);
        if (res.data.data === null) {
          document.getElementById("validate").innerText = "email not found";
          email.current.style.border = "1px solid red";
        } else if (res.data.data) {
          email.current.style.border = "1px solid green";
          document.getElementById("validate").innerText = "";
        }
      })
      .catch((err) => err);
  }, [validateEmail]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${url}/profile`,
    })
      .then((res) => {
        console.log("=====================pro response", res.data.userData);
        if (res.data.status === 200) {
          setGlobalState((prevState) => ({
            ...prevState,
            user: res.data.userData,
            isLoggedIn: true,
            role: res.data.userData.role,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          // setData((prevState) => ({ ...prevState, isLoggedIn: false }));
        }
      });
    console.log("111", globalState);
  }, []);

  // const loginWithGoogle = () => {
  //   axios({
  //     method: "get",
  //     url: "http://localhost:5000/auth/google/callback",
  //   }).then(res=>{
  //     console.log();
  //   });
  // };
  // const responseSuccessGoogle = (response) => {
  //   console.log(response);
  //   axios({
  //     method: "post",
  //     url: `${url}/auth/googleLogin`,
  //     data: {
  //       tokenId: response.tokenId,
  //     },
  //     withCredentials: true,
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       alert(res.data.message);
  //       window.location.reload();
  //       if (response.data.status === 200) {
  //         history.push("/");
  //         setGlobalState((prevState) => ({
  //           ...prevState,
  //           // user: response.data.user,
  //           isLoggedIn: !prevState.isLoggedIn,
  //           role: response.data.user.role,
  //         }));
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };
  // const responseErrorGoogle = (response) => {
  //   console.log(response);
  // };

  console.log(globalState);
  return (
    <div className="text-center">
      <Card style={{ width: "20rem", margin: "0 auto" }} className="p-4 mt-4">
        <h1>Login</h1>
        <Card.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                type="email"
                ref={email}
                required
                onChange={(e) => setValidateEmail(e.target.value)}
              />
              <Form.Text
                className="text-muted"
                id="validate"
                className="float-right"
              ></Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                ref={password}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" block>
              Login hhh
            </Button>
          </Form>

          <div style={{ margin: "10px" }}>
            {/* <GoogleLogin
              clientId="99799831451-ol8cnqaglnvpopgg5k3m2p3vne53ig7k.apps.googleusercontent.com"
              buttonText="Login With Google"
              onSuccess={responseSuccessGoogle}
              onFailure={responseErrorGoogle}
              cookiePolicy={"single_host_origin"} */}
            {/* /> */}
            <a href="https://food-mania.herokuapp.com/auth/google">
              Login With Google
            </a>
            {/* <button onClick={loginWithGoogle}>Login with google</button> */}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
