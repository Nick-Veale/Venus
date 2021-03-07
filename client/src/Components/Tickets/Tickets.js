import React, { useEffect, useState, useContext } from "react";
import DevTick from "./Developer/DevTick.js";
import UsrTick from "./User/UsrTick.js";
import { UserContext } from "../../Context/UserContext";
import { AppContext } from "../../Context/AppContext";
import { Redirect, Link } from "react-router-dom";
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

  //Fetching Tabs
  useEffect(() => {
    const anAsyncFunction = async (appid) => {
      const thing = await axios.post("http://localhost:3030/app/searchid", {
        appid: appid,
      });
      return thing.data;
    };

    currentUser &&
      Promise.all(currentUser.apps.map((appid) => anAsyncFunction(appid))).then(
        (values) => {
          console.log(values);
          setMyApps(values);
        }
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
        setAppSearch("");
        setSearchResults("");
      });
  };

  const handleSearchResults =
    searchResults &&
    searchResults.map((item) => (
      <button
        className="searchResult"
        onClick={() => handleAppClick(item)}
        key={item._id}
      >
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

  const removeAppTab = async (item) => {
    await axios
      .post("http://localhost:3030/app/removeapp", {
        appid: item._id,
        userid: currentUser._id,
      })
      .then((res) => {
        setCurrentUser(res.data);
        setCurrentApp(null);
      });
  };

  const handleSetCurrentApp = (app) => {
    app === currentApp ? setCurrentApp(null) : setCurrentApp(app);
  };

  const handleAppTabs = myApps.map(
    (item) =>
      myApps[0] && (
        <div
          className="appTab"
          onClick={() => handleSetCurrentApp(item)}
          style={handleAppTabStyle(item._id)}
          key={item._id}
        >
          <div className="removeX" onClick={() => removeAppTab(item)}>
            <div className="x" />
            <div className="y" />
          </div>
          <div className="text">{item.appName}</div>
        </div>
      )
  );

  !myApps && setCurrentApp(null);

  if (!currentUser) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="tickets">
        <div className="newAppModal" style={modalStyles()}>
          <div className="content">
            <h3>Search for an App to Add to your session.</h3>
            <form className="modalForm">
              <input
                type="text"
                placeholder="Search Apps"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
              />
            </form>
            {searchResults ? (
              <div>{handleSearchResults}</div>
            ) : (
              currentUser.isDeveloper && (
                <div>
                  <h4 className="modalOr">or...</h4>
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
              )
            )}
          </div>
          <div
            className="addAppButton"
            id="modalCloseButton"
            onClick={() => {
              setModal(!modal);
            }}
          >
            <div />
            <div />
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
            <Link to="/account" style={{ textDecoration: "none" }}>
              <div>My Account</div>
            </Link>
            <div onClick={() => logout()}>Logout</div>
          </div>
        </nav>
        <div className="ticketsDisplay">
          {currentUser.isDeveloper ? <DevTick /> : <UsrTick />}
        </div>
      </div>
    );
  }
}
