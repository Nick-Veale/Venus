import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";
import "./Current.css";
import AreYouSure from "../../AreYouSure";

export default function InProgress(props) {
  const [currentTickets, setCurrentTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState();
  const [selectedComment, setSelectedComment] = useState();
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [areYouSure, setAreYouSure] = useState(false);

  const { currentUser } = useContext(UserContext);
  const { currentApp } = useContext(AppContext);

  useEffect(() => {
    const getTickets = async (appid) => {
      const thing = await axios.post("http://localhost:3030/ticket/current", {
        appid: appid,
      });
      return thing.data;
    };

    currentUser &&
      Promise.all(currentUser.apps.map((item) => getTickets(item))).then(
        (values) => {
          let masterArray = values.flat(1);
          const newLength = masterArray.filter((item) => item.recent).length;
          props.setNumberNew(newLength);
          if (currentApp) {
            const filteredArray = masterArray.filter(
              (item) =>
                !item.recent && currentApp._id == item.app && !item.isResolved
            );
            setCurrentTickets(filteredArray);
          } else {
            const filteredArray = masterArray.filter(
              (item) => !item.recent && !item.isResolved
            );
            setCurrentTickets(filteredArray);
          }
        }
      );
  }, [currentUser, selectedTicket, currentApp]);

  const currentTicketDivs = currentTickets.map((item) => (
    <div
      className="currentTickets"
      key={item._id}
      onClick={() => setSelectedTicket(item)}
    >
      <div className="user">
        <b>User: </b>
        {item.creatorname}
      </div>
      <div className="title">
        <b>Title: </b>
        {item.title}
      </div>
      <div className="description">
        <b>Description: </b>
        {item.description.slice(0, 55)}...
      </div>
      <div className="date">
        <b>Date: </b>
        {new Date(item.date).toLocaleString()}
      </div>
    </div>
  ));

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const response = await axios
      .post("http://localhost:3030/ticket/addcomment", {
        userid: currentUser._id,
        description: newComment,
        ticket: selectedTicket._id,
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      });
    setSelectedTicket(response);
    setNewComment("");
  };

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
        console.log(res.data);
        return res.data;
      })
      .catch((err) => {
        alert(`An error has occured.
        Error: ${err}`);
      });
    setSelectedTicket(response);
    setNewReply("");
    setSelectedComment(selectedComment);
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
          onClick={() =>
            setSelectedComment(selectedComment === comment ? null : comment)
          }
          className="ticketComment"
          key={comment._id}
        >
          <div className="commentor">{comment.username}</div>
          <div className="description">{comment.description}</div>
          <div className="date">{new Date(comment.date).toLocaleString()}</div>
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
              <div className="description">{reply.description}</div>
              <div className="date">
                {new Date(reply.date).toLocaleString()}
              </div>
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

  const handleResolveTicket = async () => {
    await axios
      .post("http://localhost:3030/ticket/resolve", {
        ticket: selectedTicket._id,
        bool: !selectedTicket.isResolved,
      })
      .then(() => {
        setSelectedTicket(null);
        setAreYouSure(false);
      });
  };

  return (
    <div className="currentTicketDiv">
      <div className="leftSide">
        <div className="ticketsBeingShown">
          {currentApp
            ? `Showing tickets for ${currentApp.appName}`
            : `Showing all Tickets`}
        </div>
        {currentTickets && currentTicketDivs}
      </div>
      <div className="rightSide">
        {areYouSure ? (
          <AreYouSure
            title="Resolve Ticket?"
            description="This will move the ticket to the 'resolved' section, but you can always bring it back later"
            action={() => handleResolveTicket()}
            cancel={() => setAreYouSure(false)}
          />
        ) : (
          selectedTicket && (
            <div className="selectedTicket">
              <div className="self">
                <div className="upperContainer">
                  <div className="leftDiv">
                    <div className="user">{selectedTicket.creatorname}</div>
                    <div className="title">{selectedTicket.title}</div>
                  </div>
                  <div
                    className="markAsResolved"
                    onClick={() => setAreYouSure(true)}
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
                    <div
                      className="resolveTicketButton"
                      style={
                        selectedTicket.isResolved
                          ? { backgroundColor: "rgb(112,185,109)" }
                          : { backgroundColor: "rgb(212,61,61)" }
                      }
                    />
                  </div>
                </div>
                <div className="description">
                  <b>Description: </b>
                  {selectedTicket.description}
                </div>
              </div>
              <div className="comments">
                <form
                  className="newCommentForm"
                  onSubmit={(e) => handleSubmitComment(e)}
                >
                  <textarea
                    required
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                    placeholder="Add Comment"
                  />
                  <button type="submit">{">"}</button>
                </form>
                <div className="commentList">{commentList}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
