import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";
import "./Current.css";

export default function InProgress(props) {
  const [currentTickets, setCurrentTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState();
  const [selectedComment, setSelectedComment] = useState();
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { currentApp, setCurrentApp } = useContext(AppContext);

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
              (item) => !item.recent && currentApp._id == item.app
            );
            setCurrentTickets(filteredArray);
          } else {
            const filteredArray = masterArray.filter((item) => !item.recent);
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
      <div className="title">
        <b>Title: </b>
        {item.title}
      </div>
      <div className="description">
        <b>Description: </b>
        {item.description}
      </div>
      <div className="date">
        <b>Date: </b>
        {item.date}
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
        return res.data;
      })
      .catch((err) => {
        alert(`An error has occured.
        Error: ${err}`);
      });
    setSelectedTicket(response);
    setNewReply("");
  };

  const getCreator = async (id) => {
    const response = await axios
      .post("http://localhost:3030/ticket/getcreator", {
        id: id,
      })
      .then((res) => {
        // FINISH THIS THING
      });
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
          {/* <div className="commentor">{comment.user}</div> */}
          <div className="description">{comment.description}</div>
          <div className="date">{comment.date}</div>
          <div className="replies">{handleRepliesHelper(comment)}</div>
        </div>
        <div className="replies" style={showReplies(comment._id)}>
          {comment.replies.map((reply) => (
            <div className="reply">
              <div className="description">{reply.description}</div>
              {/* <div className="user">{reply.user}</div> */}
              <div className="date">{reply.date}</div>
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
      })
      .then((res) => {
        console.log(res.data);
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
        {selectedTicket && (
          <div className="selectedTicket">
            <div className="self">
              <div className="upperContainer">
                <div className="title">{selectedTicket.title}</div>
                <div className="markAsResolved">
                  <div>Resolve Ticket</div>
                  <input
                    type="checkbox"
                    onChange={() => handleResolveTicket()}
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
                <input
                  type="textarea"
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
        )}
      </div>
    </div>
  );
}
