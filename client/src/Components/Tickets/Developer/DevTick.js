import React, { useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import NewTickets from "./New";
import Current from "./Current";
import Resolved from "./Resolved";

export default function DevTick() {
  const [navigator, setNavigator] = useState(1);
  const [numberNew, setNumberNew] = useState(0);

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

  const setNumberNewStyle = () => {
    if (numberNew) {
      return { display: "flex" };
    } else {
      return { display: "none" };
    }
  };

  const handleDisplay = () => {
    if (navigator === 0) {
      return (
        <NewTickets
          numberNew={numberNew}
          setNumberNew={(n) => setNumberNew(n)}
        />
      );
    } else if (navigator === 1) {
      return <Current setNumberNew={(n) => setNumberNew(n)} />;
    } else if (navigator === 2) {
      return <Resolved setNumberNew={(n) => setNumberNew(n)} />;
    }
  };

  return (
    <div className="devTickDiv">
      <div className="ticketsSideNav">
        <h3>Tickets</h3>
        <div onClick={() => setNavigator(0)} style={setSideNavStyle(0)}>
          <span className="numberNew" style={setNumberNewStyle()}>
            {numberNew}
          </span>
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
