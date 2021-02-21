import React, { useState, useContext } from "react";
import DevTick from "./DevTick.js";
import UsrTick from "./UsrTick.js";
import { UserContext } from "../../Context/UserContext";
import { Redirect } from "react-router-dom";
import "./Tickets.css";

export default function Tickets() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="tickets">
        <nav className="ticketsNav">
          <h1>Venus</h1>
          <div className="myAccount">
            <div>My Account</div>
            <div onClick={() => logout()}>Logout</div>
            <div>Notifications</div>
          </div>
        </nav>
        <div className="ticketsDisplay">
          {currentUser.type === "Admin" ? <DevTick /> : <UsrTick />}
        </div>
      </div>
    );
  }
}
