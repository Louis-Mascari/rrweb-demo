import { useState } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:3001/getRecordedEvents");
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const eventData = await response.json();
      setEvents(eventData);
      setError(null);
    } catch (error) {
      setEvents([]);
      setError(error.message || "Error fetching events");
    }
  };

  return (
    <>
      <button onClick={handleClick}>Display event data</button>
      <div id="events">
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index}>{JSON.stringify(event)}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
