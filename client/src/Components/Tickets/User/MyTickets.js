import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { AppContext } from "../../../Context/AppContext";
import "./MyTickets.css";
import axios from "axios";

export default function MyTickets() {
  const [myTickets, setMyTickets] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState();

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { currentApp, setCurrentApp } = useContext(AppContext);

  useEffect(() => {
    const getTickets = async () => {
      const masterList = await axios
        .post("http://localhost:3030/ticket/mytickets", {
          userid: currentUser._id,
        })
        .then((res) => {
          console.log(res.data);
          if (currentApp) {
            const filteredList = res.data.filter(
              (item) => item.app == currentApp._id
            );
            return filteredList;
          } else {
            return res.data;
          }
        });
      setMyTickets(masterList);
    };
    getTickets();
  }, [currentApp]);

  const ticketList = myTickets.map((item) => (
    <div
      className="ticketListItem"
      key={item._id}
      onClick={() => setSelectedTicket(item)}
    >
      <div className="ticketTitle">
        <b>Title:</b> {item.title}
      </div>
      <div className="ticketDescription">
        <b>Description: </b>
        {item.description}
      </div>
      <div className="ticketDate">
        <b>Date: </b>
        {item.date}
      </div>
    </div>
  ));

  const isResolved = () => {
    return selectedTicket.isResolved ? (
      <div
        className="status"
        style={{
          color: "rgb(112,185,109)",
          border: "4px solid rgb(112,185,209)",
        }}
      >
        <b>Status: </b> Resolved.
      </div>
    ) : (
      <div
        className="status"
        style={{ color: "rgb(212,61,61)", border: "4px solid rgb(212,61,61)" }}
      >
        <b>Status: </b> Unresolved.
      </div>
    );
  };

  const commentList =
    selectedTicket &&
    selectedTicket.comments.map((item) => (
      <div className="ticketComment" key={item._id}>
        <div className="user">
          <b>Developer: </b>
          {item.user}
        </div>
        <div className="description">{item.description}</div>
        <div className="date">{item.date}</div>
      </div>
    ));

  return (
    <div className="myTicketsDiv">
      <div className="lowerDisplay">
        <div className="ticketDisplayDiv">
          <div className="filterDiv">
            {currentApp ? (
              <div className="ticketsShowing">
                Showing Tickets for {currentApp.appName}
              </div>
            ) : (
              <div className="divWithSwitch">
                <div className="ticketsShowing">Showing all Tickets</div>
              </div>
            )}
          </div>

          <div className="ticketListDiv"> {ticketList && ticketList}</div>
        </div>
        {selectedTicket && (
          <div className="selectedTicketDisplay">
            <div className="self">
              <div className="titleDiv">
                <div className="title">
                  <b>Title: </b>
                  {selectedTicket.title}
                </div>
                {isResolved()}
              </div>
              <div className="description">
                <b>Description: </b>
                {selectedTicket.description}
              </div>
              <div className="comments">
                {selectedTicket.comments ? (
                  commentList
                ) : (
                  <div>This ticket has no comments.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
