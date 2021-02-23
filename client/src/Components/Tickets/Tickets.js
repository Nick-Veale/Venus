import React, { useEffect, useState, useContext } from "react";
import DevTick from "./DevTick.js";
import UsrTick from "./UsrTick.js";
import { UserContext } from "../../Context/UserContext";
import { AppContext } from "../../Context/AppContext";
import { Redirect } from "react-router-dom";
import "./Tickets.css";
import axios from "axios";

export default function Tickets() {
  const [modal, setModal] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [regApp, setRegApp] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [myApps, setMyApps] = useState([]);

  const { currentApp, setCurrentApp } = useContext(AppContext);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    appSearch &&
      axios
        .post("http://localhost:3030/app/search", {
          data: appSearch,
        })
        .then((res) => {
          setSearchResults(res.data);
        });
  }, [appSearch]);

  // Needs a lot of work
  useEffect(() => {
    Promise.all(
      currentUser.apps.map(async (appid) => {
        await axios
          .post("http://localhost:3030/app/searchid", {
            appid: appid,
          })
          .then((app) => {
            console.log(app.data);
            setMyApps([...myApps, app.data]);
          });
      })
    );
    console.log(myApps);
  }, [currentUser]);

  const modalStyles = () => {
    if (modal) {
      return {
        display: "flex",
      };
    } else {
      return {
        display: "none",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const handleRegisterApp = (e) => {
    e.preventDefault();
    if (regApp) {
      axios
        .post("http://localhost:3030/app/register", {
          appName: regApp,
          creator: currentUser,
        })
        .then((res) => {
          if (res.status === 201) {
            alert("App registered Succesully!");
            console.log(res.data);
            // setCurrentUser(res.data)
            setModal(false);
          }
        });
    }
  };

  const handleAppClick = async (item) => {
    await axios
      .post("http://localhost:3030/app/adduser", {
        app: item,
        user: currentUser,
      })
      .then((res) => {
        console.log(res.data);
        setCurrentUser(res.data);
      });
  };

  const handleSearchResults =
    searchResults &&
    searchResults.map((item) => (
      <button className="searchResult" onClick={() => handleAppClick(item)}>
        {item.appName}
      </button>
    ));

  const handleAppTabStyle = (id) => {
    const selected = {
      backgroundColor: "white",
      color: "black",
    };
    const notSelected = {
      backgroundColor: "rgb(212,61,61)",
      color: "white",
    };
    if (currentApp) {
      if (id === currentApp._id) {
        return selected;
      } else {
        return notSelected;
      }
    }
  };

  const handleAppTabs = myApps.map((item) => (
    <div
      className="appTab"
      onClick={() => setCurrentApp(item)}
      style={handleAppTabStyle(item._id)}
      key={item._id}
    >
      {item.appName}
    </div>
  ));

  if (!currentUser) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="tickets">
        <div className="newAppModal" style={modalStyles()}>
          <div
            className="addAppButton rotate"
            onClick={() => {
              setModal(!modal);
            }}
          >
            <div />
            <div />
          </div>
          <div className="content">
            <h3>Search for an App to Add to your session.</h3>
            <form className="modalForm">
              <input
                type="text"
                placeholder="Search Apps"
                onChange={(e) => setAppSearch(e.target.value)}
              />
            </form>
            {searchResults ? (
              <div>{handleSearchResults}</div>
            ) : (
              <div>
                <h4>or...</h4>
                <h3>Register a new App</h3>
                <form
                  className="modalForm"
                  onSubmit={(e) => handleRegisterApp(e)}
                >
                  <input
                    type="text"
                    placeholder="New App Name"
                    onChange={(e) => {
                      setRegApp(e.target.value);
                    }}
                  />
                  <button type="submit">Register App</button>
                </form>
              </div>
            )}
          </div>
        </div>
        <nav className="ticketsNav">
          <h1>Venus</h1>
          <div className="myApps">
            <div className="addAppButton" onClick={() => setModal(!modal)}>
              <div />
              <div />
            </div>
            {handleAppTabs && handleAppTabs}
          </div>
          <div className="myAccount">
            <div>My Account</div>
            <div onClick={() => logout()}>Logout</div>
            <div>Notifications</div>
          </div>
        </nav>
        <div className="ticketsDisplay">
          {currentUser.isDeveloper ? <DevTick /> : <UsrTick />}
        </div>
      </div>
    );
  }
}
