import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./styles/teamview.css";
import { Redirect, Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { AppContext } from "../../Context/AppContext";

export default function TeamView() {
  const [modal, setModal] = useState(false);
  const [appSearch, setAppSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [myApps, setMyApps] = useState();
  const [regApp, setRegApp] = useState();

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { currentApp, setCurrentApp } = useContext(AppContext);

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

  const handleSetCurrentApp = (app) => {
    app === currentApp ? setCurrentApp(null) : setCurrentApp(app);
  };

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

  const handleAppTabs =
    myApps &&
    myApps.map(
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

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
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

  if (!currentUser) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="teamView">
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
        <nav className="teamViewNav">
          <h1>Venus</h1>
          <div className="myApps">
            <div className="addAppButton" onClick={() => setModal(!modal)}>
              <div />
              <div />
            </div>
            {handleAppTabs && handleAppTabs}
          </div>
          <div className="myAccount">
            <Link to="/tickets" style={{ textDecoration: "none" }}>
              <div>My Tickets</div>
            </Link>
            <Link to="/account" style={{ textDecoration: "none" }}>
              <div>My Account</div>
            </Link>
            <div onClick={() => logout()}>Logout</div>
          </div>
        </nav>
        <div className="teamViewDisplay"></div>
      </div>
    );
  }
}
