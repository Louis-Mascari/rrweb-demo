import { useState } from "react";
// import { getReplayConsolePlugin } from "rrweb";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

function App() {
  const [error, setError] = useState(null);
  let initialTimeStamp;
  let player;

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

      initialTimeStamp = combinedEvents[0].timestamp;
      player = new rrwebPlayer({
        target: document.getElementById("replayer"),
        props: {
          events: combinedEvents,
        },
        // plugins: [
        //   getReplayConsolePlugin({
        //     levels: ["info", "log", "warn", "error"],
        //   }),
        // ],
      });
      const consoleEvents = extractConsoleEvents(combinedEvents);
      populateConsoleDiv(consoleEvents);
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
      const relTime = relativeTime(event.timestamp);
      listItem.textContent = `Time: ${formatTime(relTime)} ${
        event.data.payload.payload
      }`;

      listItem.onclick = () => {
        player.goto(Math.floor(relTime * 1000));
      };

      list.appendChild(listItem);
    });
  };

  const relativeTime = (timestamp) => {
    return (timestamp - initialTimeStamp) / 1000;
  };

  // Helper function to pad the number with zeros
  const padWithZeros = (number, length) => {
    let str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  };

  // Function to convert seconds to the formatted time string (mm:ss)
  const formatTime = (seconds) => {
    const roundedSeconds = Math.floor(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    // Pad minutes and seconds with zeros
    const paddedMinutes = padWithZeros(minutes, 2);
    const paddedSeconds = padWithZeros(remainingSeconds, 2);

    return `${paddedMinutes}:${paddedSeconds}`;
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
