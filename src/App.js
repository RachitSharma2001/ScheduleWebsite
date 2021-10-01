import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Popup from './Popup.js';
import Button from './Button.js';
import EntryForm from './EntryForm.js';
import './App.css';
import './Popup.css';

function App() {
  // Have a use Effect to get the todos from past days
  // useState(value) creates these two getter, setter variables such that its initial value is value
  const [addTodo, setAddTodo] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");

  const toggleAddTodo = () => {
    setAddTodo(!addTodo);
  };

  const toggleAddEntry = () => {
    setAddEntry(!addEntry);
  };

  useEffect(() =>{
    fetch("http://localhost:5000/getEntries/1").then(res => res.json()).then(data => {
      console.log("Returned message: " + data.EntryList);
    });
  });
  
  // For creating the popup object we do: <Popup content = {... some html ...} handeClose={}>
  // what is content -> content something we define in Popup js -> when we render a popup in popup.js
  // we do {props.content} which shows its variable called content
  return (
    <div className="App">
      <header className="App-header">
        <Button id="TodoAdd" buttonLabel="Add Todo for a day" height="200px" width="200px" onClick={toggleAddTodo}></Button>
        
        {addTodo && <Popup content={<>
          <p> Hi this is a popup! </p> 
          <Button id="EntryAdd" buttonLabel="Add Entry" height="200px" width="200px" onClick={toggleAddEntry}></Button>
          {addEntry && <EntryForm url="http://localhost:5000/addEntry/" todoId="1"/>}
        </>} handleClose={toggleAddTodo}></Popup>}
      </header>
    </div>
  );
}

export default App;
