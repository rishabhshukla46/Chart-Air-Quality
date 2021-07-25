import "./styles.css";
import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("wss://city-ws.herokuapp.com/");

function colorSelect(num) {
  if (num === 0) {
    return "white";
  } else if (num <= 50) {
    return "#2b9348";
  } else if (num <= 100) {
    return "#80b918";
  } else if (num <= 200) {
    return "#ffff3f";
  } else if (num <= 300) {
    return "#dda15e";
  } else if (num <= 400) {
    return "#fd520b";
  } else if (num <= 500) {
    return "#d7263d";
  }
  return "#6b0504";
}

function updateSet(dateObj) {
  const dateNow = new Date();
  const diffrence = (dateNow.getTime() - dateObj.getTime()) / 1000;

  return `${diffrence.toFixed(0)} seconds ago`;
}
function Entry(item, key) {
  return (
    <div
      className="board-entry"
      style={{
        backgroundColor: `${colorSelect(item.aqi)}`,
        opacity: `${item.aqi ? 1 : 0.3}`
      }}
      id={key}
    >
      <div className="city-name">{item.city}</div>
      <div className="city-aqi">
        {item.aqi === 0 ? "No Data" : item.aqi.toFixed(2)}
      </div>
      <div className="last-updated">
        {item.aqi === 0 ? "" : updateSet(item.lastUpdated)}
      </div>
    </div>
  );
}

export default function App() {
  const [timer, setTimer] = useState(0);
  const [main, SetMain] = useState({
    Delhi: { aqi: 0, lastUpdated: new Date() },
    Mumbai: { aqi: 0, lastUpdated: new Date() },
    Bengaluru: { aqi: 0, lastUpdated: new Date() },
    Pune: { aqi: 0, lastUpdated: new Date() },
    Hyderabad: { aqi: 0, lastUpdated: new Date() },
    Kolkata: { aqi: 0, lastUpdated: new Date() },
    Indore: { aqi: 0, lastUpdated: new Date() },
    Bhubaneswar: { aqi: 0, lastUpdated: new Date() },
    Chandigarh: { aqi: 0, lastUpdated: new Date() },
    Lucknow: { aqi: 0, lastUpdated: new Date() },
    Jaipur: { aqi: 0, lastUpdated: new Date() },
    Kolkata: { aqi: 0, lastUpdated: new Date() },
    Chennai: { aqi: 0, lastUpdated: new Date() }
  });

  useEffect(() => {
    setTimeout(() => {
      setTimer(timer + 1);
    }, 100);
  }, [timer]);
  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.length) {
        dataFromServer.map((item) => {
          const obj = main;
          if (obj[item.city]) {
            obj[item.city].aqi = item.aqi;
            obj[item.city].lastUpdated = new Date();
            SetMain(obj);
          }
        });
      }
    };
  }, [timer]);

  return (
    <div className="App">
      <h1>Air Quality Standards</h1>
      <div className="board-container">
        <div className="board-entry-main">
          <div className="city-name-main">City</div>
          <div className="city-aqi-main">AQI Index</div>
          <div className="last-updated-main">Last Updated</div>
        </div>
        {Object.keys(main).map((item) => {
          return Entry(
            {
              city: item,
              aqi: main[item].aqi,
              lastUpdated: main[item].lastUpdated
            },
            item
          );
        })}
      </div>
    </div>
  );
}
