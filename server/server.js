const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const recordedEvents = [];

app.post("/record", (req, res) => {
  const { events } = req.body;
  recordedEvents.push({ events });
  console.log("Recorded events:", events);
  res.sendStatus(200);
});

app.get("/getRecordedEvents", (req, res) => {
  res.json(recordedEvents);
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
