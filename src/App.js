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
      // Add the todos with > 0 entries
      let tempTodoList = [];
      for(let i = 0; i < data.todoList.length; i++){
        let todoEntries = [];
        for(let j = 0; j < data.todoList[i].length; j++){
          todoEntries.push(data.todoList[i][j]);
        }
        if(todoEntries.length == 0) continue;
        tempTodoList.push(todoEntries);
      }
      
      setTodoList(todoList => tempTodoList);
    });
  }, []);

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
        
        {todoList.map((todos) => <div className="todoBordBox"> {todos} </div>)}
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
