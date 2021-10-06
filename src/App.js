import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Popup from './Popup.js';
import Button from './Button.js';
import EntryForm from './EntryForm.js';
import './App.css';
import './Popup.css';
import './TodoBox.css';

function updateTodos(todoList, setTodoList){
  //console.log("Updating todos!");
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
      
      //console.log("Done, this is temp todo list: " + tempTodoList);
      setTodoList(todoList => tempTodoList);
  });
}

function App() {
  const [addTodo, setAddTodo] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  // List of entries of the todo in the current popup windowd
  const [entryList, setEntryList] = useState([]);
  // List of entries for each todo
  const [todoList, setTodoList] = useState([]);
  // Current todo id (needed as a parameter to entryform)
  const [currTodoId, setTodoId] = useState("-1");
  
  // Display the current todos right when user loads window
  useEffect(() => {
    updateTodos(todoList, setTodoList);
  }, []);

  const toggleAddTodo = () => {
    // If the todo button was clicked, create a new todo database object
    if(!addTodo){
      //console.log("We are adding a todo!");
      fetch("http://localhost:5000/addTodo", {method: "POST"}).then(res => res.json()).then(data => {
        console.log("Adding a todo of id: " + data.todoId);
        // update current todo id
        setTodoId(data.todoId.toString());
        // Wait for the todo id to be created before adding the todo
        setAddTodo(!addTodo);
      });
    }else{
      setAddTodo(!addTodo);
    }
  };

  const updateEntryList = (entryText) => {
    setEntryList(entryList => [...entryList, {id:entryList.length, text:entryText}])
  }

  const toggleAddEntry = () => {
    setAddEntry(!addEntry);
  };

  const todoAdded = () => {
    // Close popup
    toggleAddTodo();
    // Call function to update the todos
    updateTodos(todoList, setTodoList);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <Button id="TodoAdd" buttonLabel="Add Todo for a day" height="200px" width="200px" onClick={toggleAddTodo}/>
        
        {todoList.map((todos) => <div className="todoBordBox"> {todos} </div>)}
        {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url="http://localhost:5000/addEntry/" todoId={currTodoId} submitCallBack={updateEntryList}/>
          <Button id="finishedAdding" buttonLabel="Done" height="200px" width="200px" onClick={todoAdded}/>
        </>} handleClose={toggleAddTodo}></Popup>}
      </header>
    </div>
  );
}

export default App;
