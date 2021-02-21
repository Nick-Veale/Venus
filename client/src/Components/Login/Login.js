import React, { useState, useContext } from "react";
import "./Login.css";
import LoginForm from "./LoginInputs";
import SignupForm from "./SignupInputs";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { Redirect } from "react-router-dom";

export default function Login() {
  const [signup, setSignup] = useState(true);
  const [developer, setDeveloper] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [appName, setAppName] = useState("");

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    console.log("handleSubmitInit");
    e.preventDefault();
    if (username === "" || password === "") {
      alert("Please fill in All Boxes");
    } else {
      if (signup) {
        if (developer === false) {
          await axios
            .post("http://localhost:3030/user/signup", {
              email: email,
              username: username,
              password: password,
            })
            .then((res) => {
              setCurrentUser(res.data);
            });
        } else {
          // Needs WORK! Figure out how to conditionally call API
          await axios
            .post("http://localhost:3030/user/signup/appcheck", {
              app: appName,
            })
            .then(() => {
              axios
                .post("http://localhost:3030/user/signup/admin", {
                  email: email,
                  username: username,
                  password: password,
                  developer: developer,
                  app: appName,
                })
                .then((res) => {
                  setCurrentUser(res.data);
                });
            })
            .catch((err) => {
              alert(`Your App didn't match any records. Error:${err}`);
            });
        }
      } else {
        console.log("login init");
        await axios
          .post("http://localhost:3030/user/login", {
            username: username,
            password: password,
          })
          .then((res) => {
            if (res.status !== 200) {
              alert(`An error has occured Error:${res.status}`);
            } else {
              console.log(res.data);
              setCurrentUser(res.data);
            }
          });
      }
    }
  };

  const handleInputs = () => {
    if (signup) {
      return (
        <SignupForm
          submit={(e) => handleSubmit(e)}
          username={(input) => {
            setUsername(input);
          }}
          password={(input) => {
            setPassword(input);
          }}
          developer={(input) => {
            setDeveloper(input);
          }}
          email={(input) => {
            setEmail(input);
          }}
          appName={(input) => {
            setAppName(input);
          }}
        />
      );
    } else {
      return (
        <LoginForm
          submit={(e) => handleSubmit(e)}
          username={(input) => {
            setUsername(input);
          }}
          password={(input) => {
            setPassword(input);
          }}
        />
      );
    }
  };

  const handleStyle = (n) => {
    if (signup) {
      if (n === 2) {
        return {
          color: "grey",
          backgroundColor: "white",
        };
      } else {
        return {
          color: "white",
          backgroundColor: "rgb(212,61,61)",
        };
      }
    } else {
      if (n === 1) {
        return {
          color: "grey",
          backgroundColor: "white",
        };
      } else {
        return {
          color: "white",
          backgroundColor: "rgb(212,61,61)",
        };
      }
    }
  };

  if (!currentUser || currentUser.isLoggedIn === false) {
    return (
      <div className="login">
        <div className="formContainer">
          <h1>Venus</h1>
          <h2>Welcome to Venus!</h2>
          <h2>Log in or Sign Up to Continue</h2>
          <div>{handleInputs()}</div>
        </div>
        <div className="logSigBut">
          <div
            style={handleStyle(1)}
            onClick={() => {
              setSignup(false);
            }}
          >
            Log In
          </div>
          <div
            style={handleStyle(2)}
            onClick={() => {
              setSignup(true);
            }}
          >
            Sign Up
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/tickets" />;
  }
}
