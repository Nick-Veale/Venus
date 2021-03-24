import React from "react";

export default function AreYouSure({ title, description, action, cancel }) {
  return (
    <div className="areYouSureContainer">
      <div className="areYouSure">
        <div className="redContainer">
          <h3>{title}</h3>
        </div>
        <h4>{description}</h4>
        <div className="yesOrNo">
          <button onClick={() => action()}>Yes</button>
          <button onClick={() => cancel()}>No</button>
        </div>
      </div>
    </div>
  );
}
