import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Popup from './Popup.js';
import Button from './Button.js';
import EntryForm from './EntryForm.js';
import './App.css';
import './Popup.css';
import './TodoBox.css';

function App() {
  const [addTodo, setAddTodo] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  // List of entries of the todo in the current popup windowd
  const [entryList, setEntryList] = useState([]);
  // List of entries for each todo
  const [todoList, setTodoList] = useState([]);

  const toggleAddTodo = () => {
    // If the todo button was clicked, create a new todo database object
    if(!addTodo){
      fetch("http://localhost:5000/addTodo", {method: "POST"}).then(res => res.json()).then(data => {
      });
    }
    setAddTodo(!addTodo);
  };

  useEffect(() => {
    fetch("http://localhost:5000/getTodos").then(res => res.json()).then(data => {
      console.log("The todo list length: " + data.todoList.length)
    });
  });

  const updateEntryList = (entryText) => {
    console.log("Entry list length: " + entryList.length);
    setEntryList(entryList => [...entryList, {id:entryList.length, text:entryText}])
  }

  const toggleAddEntry = () => {
    setAddEntry(!addEntry);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <Button id="TodoAdd" buttonLabel="Add Todo for a day" height="200px" width="200px" onClick={toggleAddTodo}></Button>
        
        <div className="todoBordBox"> <p> Stuff </p> <p> Other Stuff </p> </div>
        {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url="http://localhost:5000/addEntry/" todoId="2" submitCallBack={updateEntryList}/>
        </>} handleClose={toggleAddTodo}></Popup>}
      </header>
    </div>
  );
}

export default App;
