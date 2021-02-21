import React, { useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import NewTickets from "./NewTickets";
import InProgress from "./InProgress";
import Resolved from "./Resolved";

export default function DevTick() {
  const [navigator, setNavigator] = useState(1);

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const setSideNavStyle = (n) => {
    const colorScheme = () => {
      if (navigator === 0) {
        return "rgb(212, 0, 0)";
      } else if (navigator === 1) {
        return "rgb(212, 100, 100)";
      } else if (navigator === 2) {
        return "rgb(112,185,109)";
      }
    };

    const filled = {
      backgroundColor: colorScheme(),
      border: `2px solid ${colorScheme()}`,
    };
    const empty = {
      backgroundColor: "inherit",
    };
    if (n === navigator) {
      return filled;
    } else {
      return empty;
    }
  };

  const handleDisplay = () => {
    if (navigator === 0) {
      return <NewTickets />;
    } else if (navigator === 1) {
      return <InProgress />;
    } else if (navigator === 2) {
      return <Resolved />;
    }
  };

  return (
    <div className="devTickDiv">
      <div className="ticketsSideNav">
        <div onClick={() => setNavigator(0)} style={setSideNavStyle(0)}>
          New
        </div>
        <div onClick={() => setNavigator(1)} style={setSideNavStyle(1)}>
          Current
        </div>
        <div
          id="resolvedButton"
          onClick={() => setNavigator(2)}
          style={setSideNavStyle(2)}
        >
          Resolved
        </div>
      </div>
      <div className="displayWindow">{handleDisplay()}</div>
    </div>
  );
}
