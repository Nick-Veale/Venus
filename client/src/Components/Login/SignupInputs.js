import React, { useState } from "react";
import "./Slider.css";

export default function SignupInputs(props) {
  const [developer, setDeveloper] = useState(false);

  const handleSwitch = () => {
    const bool = !developer;
    props.developer(bool);
    setDeveloper(bool);
  };

  return (
    <form onSubmit={(e) => props.submit(e)}>
      <div className="switchBox">
        <label className="switch">
          <input type="checkbox" onChange={() => handleSwitch()} />
          <span className="slider"></span>
        </label>
        <div>Are you a Developer?</div>
      </div>
      <div className="formInline">
        <div className="formInputDiv">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => {
              props.email(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => {
              props.username(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => {
              props.password(e.target.value);
            }}
          />
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
