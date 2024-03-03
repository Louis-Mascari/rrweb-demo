import React, { useEffect } from "react";
import { record } from "rrweb";

const TargetApp = () => {
  let events = [];

  useEffect(() => {
    const stopRecording = record({
      emit(event) {
        events.push(event);
      },
    });

    const saveEventsInterval = setInterval(save, 10000);

    const handleBeforeUnload = () => {
      stopRecording();
      save();
      clearInterval(saveEventsInterval);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    // may be unnecessary to explicitly stop recording and clear interval
    // but could be good to ensure no memory leak
    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const save = () => {
    const body = JSON.stringify({ events });
    events = [];
    fetch("http://localhost:3001/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  };

  return (
    <>
      <h1>Hello world!</h1>
      <h3>Welcome to my site!</h3>
      <input type="text"></input>
    </>
  );
};

export default TargetApp;
