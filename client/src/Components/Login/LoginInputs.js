import React from "react";

export default function LoginInputs(props) {
  return (
    <form onSubmit={(e) => props.submit(e)}>
      <div className="formInputDiv">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            props.username(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            props.password(e.target.value);
          }}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
