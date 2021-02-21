import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Tickets from "./Components/Tickets/Tickets";
import { UserContext } from "./Context/UserContext";
import MyAccount from "./Components/MyAccount/MyAccount";

export default function App() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const data = localStorage.getItem("currentUser");
    const newData = JSON.parse(data);
    if (data) {
      setCurrentUser(newData);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <div>
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Route exact path="/" component={Login} />
          <Route path="/tickets" component={Tickets} />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}
