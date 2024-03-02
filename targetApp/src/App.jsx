import React, { useEffect } from "react";
import { record } from "rrweb";

const App = () => {
  useEffect(() => {
    const stopRecording = record({
      emit(event) {
        // Send events to backend
        fetch("http://localhost:3001/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: [event] }),
        });
      },
    });

    // Cleanup on unmount
    return stopRecording;
  }, []);

  return (
    <>
      <h1>Hello world!</h1>
      <h3>Welcome to my site!</h3>
    </>
  );
};

export default App;
