import React, { useEffect } from "react";
import { record, getRecordConsolePlugin } from "rrweb";

const TargetApp = () => {
  let events = [];
  let networkRequests = [];

  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    // Your Fetch interception logic here
    const obj = {
      url: input,
      method: init.method,
      headers: init.headers,
      body: init.body.slice(0, 30),
      type: "FETCH",
      timeStamp: Date.now(),
    };
    const result = originalFetch.apply(this, arguments);

    result
      .then((res) => {
        obj.status = res.status;
        networkRequests.push(obj);
        return res;
      })
      .catch((error) => {
        console.error("Fetch Error: ", error);
      });

    return result;
  };

  useEffect(() => {
    const stopRecording = record({
      emit(event) {
        events.push(event);
        //
        //   const defaultLog = console.log["__rrweb_original__"]
        //     ? console.log["__rrweb_original__"]
        //     : console.log;
      },
      plugins: [getRecordConsolePlugin()],
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
      <h1 onClick={() => console.log("Hello world clicked")}>Hello world!</h1>
      <h3 onClick={() => console.log("Welcome message clicked")}>
        Welcome to my site!
      </h3>
      <input type="text" onChange={() => console.log("typed in input")}></input>
      <button onClick={() => console.error(new Error())}>
        Click for error
      </button>
      <button onClick={() => console.log(networkRequests)}>Log Requests</button>
    </>
  );
};

export default TargetApp;
