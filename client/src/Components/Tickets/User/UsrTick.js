import React, { useState } from "react";
import CreateTicket from "./CreateTicket";
import MyTickets from "./MyTickets";

export default function UsrTick() {
  const [navigator, setNavigator] = useState(1);

  const setSideNavStyle = (n) => {
    const colorScheme = () => {
      if (navigator === 0) {
        return "rgb(112, 185, 109)";
      } else if (navigator === 1) {
        return "rgb(212, 0, 0)";
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
      return <CreateTicket setNavigator={(n) => setNavigator(n)} />;
    } else if (navigator === 1) {
      return <MyTickets />;
    }
  };

  return (
    <div className="usrTickDiv">
      <div className="ticketsSideNav">
        <div
          id="resolvedButton"
          onClick={() => setNavigator(0)}
          style={setSideNavStyle(0)}
        >
          Create Ticket
        </div>
        <div
          onClick={() => {
            setNavigator(1);
          }}
          style={setSideNavStyle(1)}
        >
          My Tickets
        </div>
      </div>
      <div className="displayWindow">{handleDisplay()}</div>
    </div>
  );
}
