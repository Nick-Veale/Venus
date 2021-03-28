import React, { useRef, useState, useContext } from "react";
import { AppContext } from "../../../Context/AppContext";
import { UserContext } from "../../../Context/UserContext";
import "./CreateTicket.css";
import axios from "axios";

export default function NewTickets(props) {
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { currentApp, setCurrentApp } = useContext(AppContext);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();

    const responseApp = await axios
      .post("http://localhost:3030/ticket/newticket", {
        user: currentUser,
        app: currentApp,
        title: ticketTitle,
        description: ticketDesc,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    setCurrentApp(responseApp);
    setTicketTitle("");
    setTicketDesc("");
    props.setNumberNew(props.numberNew + 1);
    props.setNavigator(currentUser.isDeveloper ? 0 : 1);
  };

  if (!currentApp) {
    return <div className="ticketsBeingShown">Create or Select an App</div>;
  } else {
    return (
      <div className="displayWindow">
        <form className="newTicketForm" onSubmit={(e) => handleTicketSubmit(e)}>
          <h3 id="ticketFormH3">New Ticket for {currentApp.appName}</h3>
          <h2 className="ticketLabel">
            Ticket Title <i>{ticketTitle.length}/60</i>
          </h2>
          <input
            type="text"
            onChange={(e) => setTicketTitle(e.target.value)}
            value={ticketTitle}
            placeholder="Give a title for your issue"
            maxLength="60"
            required
          />
          <h2 className="ticketLabel">Description</h2>
          <textarea
            type="textarea"
            onChange={(e) => setTicketDesc(e.target.value)}
            value={ticketDesc}
            placeholder="Describe the issue you are experiencing"
            required
          />
          <button type="submit">Submit Ticket</button>
        </form>
      </div>
    );
  }
}
