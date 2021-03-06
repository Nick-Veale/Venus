import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import "./MyAccount.css";

export default function MyAccount() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <div className="myAccount">
      <nav className="nav">
        <div className="leftDiv">
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <div className="navLink">Home</div>
          </Link>
        </div>
        <h1 className="logo">Venus</h1>
        <div className="rightDiv">
          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <div className="navLink" onClick={() => logout()}>
              Logout
            </div>
          </Link>
        </div>
      </nav>
      <div className="profile">
        <div className="content">
          <div className="field">
            <div className="descriptor">User Name:</div>
            <div className="value">{currentUser.username}</div>
          </div>
          <div className="field">
            <div className="descriptor">Email:</div>
            <div className="value">{currentUser.email}</div>
          </div>
          <div className="field">
            <div className="descriptor">Member Since:</div>
            <div className="value">{currentUser.date.slice(0, 10)}</div>
          </div>
          <div className="field">
            <div className="descriptor">Account Type:</div>
            <div className="value">
              {currentUser.isDeveloper ? `Developer` : `User`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
