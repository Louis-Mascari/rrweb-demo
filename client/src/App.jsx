import { useState } from "react";
import { getReplayConsolePlugin } from "rrweb";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

function App() {
  const [error, setError] = useState(null);

  const handleClick = async () => {
    let replayerDiv = document.getElementById("replayer");
    if (replayerDiv.firstChild) {
      replayerDiv.removeChild(replayerDiv.firstChild);
    }

    try {
      const response = await fetch("http://localhost:3001/getRecordedEvents");
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const eventData = await response.json();
      if (eventData.length === 0) {
        throw new Error("Event data is empty.");
      }

      const combinedEvents = eventData.reduce(
        (allEvents, currentEvent) => allEvents.concat(currentEvent.events),
        []
      );
      setError(null);
      // console.log(combinedEvents);
      const consoleEvents = extractConsoleEvents(combinedEvents);
      // console.log(consoleEvents);
      populateConsoleDiv(consoleEvents);
      new rrwebPlayer({
        target: document.getElementById("replayer"),
        props: {
          events: combinedEvents,
        },
        plugins: [
          getReplayConsolePlugin({
            levels: ["info", "log", "warn", "error"],
          }),
        ],
      });
    } catch (error) {
      setError(error.message || "Error fetching events");
    }
  };

  const extractConsoleEvents = (eventsArr) => {
    return eventsArr.filter((obj) => obj.data.plugin === "rrweb/console@1");
  };

  const populateConsoleDiv = (eventsArr) => {
    const list = document.getElementById("console-list");

    eventsArr.forEach((event) => {
      const listItem = document.createElement("li");
      listItem.textContent = event.data.payload.payload;
      list.appendChild(listItem);
    });
  };

  return (
    <>
      <button onClick={handleClick}>Display Session</button>
      {error && (
        <div id="error">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
      <div id="replayer"></div>
      <div id="console">
        <ul id="console-list"></ul>
      </div>
    </>
  );
}

export default App;
