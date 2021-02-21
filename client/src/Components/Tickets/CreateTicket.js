import React from "react";

export default function CreateTicket() {
  return (
    <div>
      <form>
        <input type="text" placeholder="Title" />
        <input type="text" placeholder="Description" />
        <input type="app" placeholder="Which App is this for?" />
      </form>
    </div>
  );
}
