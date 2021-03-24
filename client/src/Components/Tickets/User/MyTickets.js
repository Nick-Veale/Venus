import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { AppContext } from "../../../Context/AppContext";
import "./MyTickets.css";
import axios from "axios";

export default function MyTickets() {
  const [myTickets, setMyTickets] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState();
  const [selectedComment, setSelectedComment] = useState();
  const [newReply, setNewReply] = useState("");

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { currentApp, setCurrentApp } = useContext(AppContext);

  useEffect(() => {
    const getTickets = async () => {
      const masterList = await axios
        .post("http://localhost:3030/ticket/mytickets", {
          userid: currentUser._id,
        })
        .then((res) => {
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
  }, [currentApp, selectedTicket, currentUser]);

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
        {item.description.slice(0, 42)}...
      </div>
      <div className="ticketDate">
        <b>Date: </b>
        {new Date( item.date ).toLocaleString()}
      </div>
    </div>
  ));

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    const response = await axios
      .post("http://localhost:3030/ticket/addreply", {
        userid: currentUser._id,
        description: newReply,
        ticket: selectedTicket._id,
        comment: selectedComment._id,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        alert(`An error has occured.
        Error: ${err}`);
      });
    setSelectedTicket(response);
    setNewReply("");
  };

  const showReplies = (id) => {
    if (selectedComment) {
      if (id == selectedComment._id) {
        return { height: "auto" };
      } else {
        return { height: "0px" };
      }
    } else {
      return { height: "0px" };
    }
  };

  const handleRepliesHelper = (comment) => {
    if (comment.replies.length > 0 && selectedComment === comment) {
      return `Click to hide ${comment.replies.length} replies`;
    } else if (comment.replies.length > 0) {
      return `Click to view ${comment.replies.length} replies`;
    } else {
      return `Click to add reply`;
    }
  };

  const handleRepliesStyles = (comment) => {
    if (comment.replies.length > 0 && selectedComment === comment) {
      return { color: "rgb(212,61,61)" };
    } else if (comment.replies.length > 0) {
      return { color: "rgb(112,185,109)" };
    } else {
      return { color: "grey" };
    }
  };

  const commentList =
    selectedTicket &&
    selectedTicket.comments.map((comment) => (
      <div>
        <div
          className="ticketComment"
          onClick={() =>
            setSelectedComment(selectedComment === comment ? null : comment)
          }
          key={comment._id}
        >
          <div className="user">
            <b>Developer: </b>
            {comment.username}
          </div>
          <div className="description">{comment.description}</div>
          <div className="date">{new Date( comment.date ).toLocaleString()}</div>
          <div
            className="clickToViewReplies"
            style={handleRepliesStyles(comment)}
          >
            {handleRepliesHelper(comment)}
          </div>
        </div>
        <div className="replies" style={showReplies(comment._id)}>
          {comment.replies.map((reply) => (
            <div className="reply">
              <div className="user">{reply.username}</div>
              <div className="description" style={{ fontSize: "1em" }}>
                {reply.description}
              </div>
              <div className="date">{new Date( reply.date ).toLocaleString()}</div>
            </div>
          ))}
          <form
            className="commentReplyForm"
            onSubmit={(e) => handleSubmitReply(e)}
          >
            <input
              type="textarea"
              required
              onFocus={() => setSelectedComment(comment)}
              placeholder="Add reply"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <button type="submit">{">"}</button>
          </form>
        </div>
      </div>
    ));

  return (
    <div className="myTicketsDiv">
      <div className="lowerDisplay">
        <div className="ticketDisplayDiv">
          <div className="ticketsBeingShown">
            {currentApp
              ? `Showing tickets for ${currentApp.appName}`
              : `Showing all Tickets`}
          </div>
          <div className="ticketListDiv"> {ticketList && ticketList}</div>
          <div className="bottomFeather" />
        </div>
        <div className="selectedTicketDisplay">
          {selectedTicket && (
            <div className="self">
              <div className="upperContainer">
                <div className="leftDiv">
                  <div className="title">
                    <b>Title: </b>
                    {selectedTicket.title}
                  </div>
                </div>
                <div
                  className="markAsResolved"
                  style={
                    selectedTicket.isResolved
                      ? {
                          border: "4px solid rgb(112,185,109)",
                        }
                      : {
                          border: "4px solid rgb(212,61,61)",
                        }
                  }
                >
                  <div
                    style={
                      selectedTicket.isResolved
                        ? {
                            color: "rgb(112,185,109)",
                          }
                        : { color: "rgb(212,61,61" }
                    }
                  >
                    {selectedTicket.isResolved
                      ? "Reopen Ticket"
                      : "Resolve Ticket"}
                  </div>
                </div>
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
          )}
        </div>
      </div>
    </div>
  );
}
