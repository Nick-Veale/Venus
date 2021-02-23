import React, { useEffect } from "react";
import Axios from "axios";

export default function NewTickets() {
  return (
    <div className="displayWindow">
      <form>
        <input type="text" placeholder="Ticket Title" />
        <input type="text" placeholder="Description" />
        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}
