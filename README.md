# rreweb-demo

1. `targetApp` is the application in which we want to record user sessions.
2. `server` is our backend application to send and retrieve recordings from.
3. `client` is our frontend application to display these sessions.

Navigate to each directory, run `npm install`.

To test:

1.  begin by navigating to `server` and running `npm run start` to start the express server.
2.  navigate to `targetApp` and run `npm run dev` to begin the target application, as you interact with it, you should see the events being logged to the express server.
3.  With express server still running (as currently data is held in memory), navigate to `client` directory and run `npm run dev` to open the sample frontend application. Click the button to fetch the data from the backend and display it on screen.
