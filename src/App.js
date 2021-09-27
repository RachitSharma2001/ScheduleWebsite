import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    /*fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });*/
    fetch('http://localhost:5000/time').then(res => {
      console.log("Result: " + res);
      let resultJson = res.json();
      console.log("Result json: " + resultJson);
      console.log("Time: " + resultJson.time);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {currentTime}.</p>
      </header>
    </div>
  );
}

export default App;

/*import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  var [message, setMessage] = useState(0);

  useEffect(() => {
    fetch('/getmessage').then(res => res.json()).then(data => {
      console.log("Message: " + data.message);
      setMessage(data.message);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <p> Message: {message} </p>
      </header>
    </div>
  );
}

export default App;*/
