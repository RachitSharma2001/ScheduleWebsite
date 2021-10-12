import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Popup from './Popup.js';
import Button from './Button.js';
import EntryForm from './EntryForm.js';
//import TodoEntry from './TodoEntry.js';
import './App.css';
import './Popup.css';
import './TodoBox.css';

function updateTodos(todoList, setTodoList){
  // Get all the todos with greater than 0 entries
  // And update the todo and date list with them
  console.log("Going to make fetch to update todos");
  fetch("http://localhost:5000/getTodos").then(res => res.json()).then(data => {
      let tempTodoList = [];
      let tempDateList = [];
      let numItemsAdded = 0;
      for(let i = data.todoList.length-1; i >= 0; i--){
        let todoEntries = [];
        for(let j = 0; j < data.todoList[i].length; j++){
          let crossedOut = "";
          if(data.todoList[i][j][1] == "True"){
            crossedOut = "line-through";
          }
          todoEntries.push({id: j, text: data.todoList[i][j][0], crossedOut: crossedOut});
        }
        if(todoEntries.length == 0) continue;
        tempTodoList.push({id: data.idList[i], entries: todoEntries, date: data.dateList[i], index: numItemsAdded});
        numItemsAdded++;
      }

      
      console.log("Temp todo list at 0: " + tempTodoList[0]);
      console.log("Temp todo list entry cross out at 0, 0: " + tempTodoList[0].entries[0].crossedOut)
      setTodoList(todoList => tempTodoList);
  });
}

function changeTodoList(oldTodoList, newTodoList, setTodoList){
  setTodoList(oldTodoList => newTodoList);
}

function TodoEntry(props){
  const [crossOut, setCrossOut] = useState(props.crossOut);
  const setCrossedOut = (e) => {
    fetch(props.backendUrl + props.todoId + "/" + props.entryId, {method:"POST"}).then(res => res.json()).then(data => {
      //updateTodos(props.todoList, props.setTodoList);
      let tempTodoList = props.todoList;
      console.log("Props index: " + props.indexInList)
      console.log("Todo List at todo id: " + tempTodoList[props.indexInList]);
      tempTodoList[props.indexInList].entries[props.entryId].crossedOut = "line-through";
      changeTodoList(props.todoList, tempTodoList, props.setTodoList);
      //setCrossOut("line-through");
      //console.log("Todo list at todoId, entryId: " + props.todoList[props.todoId]);
      //(props.todoList, props.setTodoList, props.todoId);
    });
  }
  return (<div> <p style={{textDecoration:props.crossOut}}> {props.text} </p> <button onClick={setCrossedOut}>X</button></div>)
}


function App() {
  const [addTodo, setAddTodo] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  // List of entries of the todo in the current popup windowd
  const [entryList, setEntryList] = useState([]);
  // List of entries for each todo
  const [todoList, setTodoList] = useState([]);
  // List of dates corresponding to each todo
  //const [dateList, setDateList] = useState([]);
  // Current todo id (needed as a parameter to entryform)
  const [currTodoId, setTodoId] = useState("-1");
  
  // Display the current todos right when user loads window
  useEffect(() => {
    updateTodos(todoList, setTodoList);
  }, []);

  const popupClosed = () => {
    // If the todo button was clicked, create a new todo database object. Else Untoggle the popup
    if(!addTodo){
      fetch("http://localhost:5000/addTodo", {method: "POST"}).then(res => res.json()).then(data => {
        // update current todo id
        setTodoId(data.todoId.toString());
        // Wait for the todo id to be created before adding the todo
        setAddTodo(!addTodo);
      });
    }else{
      setAddTodo(!addTodo);
      setEntryList([]);
    }
  };

  const updateEntryList = (entryText) => {
    console.log("Updating!");
    setEntryList(entryList => [...entryList, {id:entryList.length, text:entryText}])
  }

  const todoAdded = () => {
    // Close popup
    popupClosed();
    // Call function to update the todos
    updateTodos(todoList, setTodoList);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <button id="TodoAdd" style={{height: "60px", width: "200px"}} onClick={popupClosed}> Add Todo for a day </button>
        
        {todoList.map((todos) => <div className="todoBordBox"> <b style={{alignItems: 'center'}}> {todos.date} </b> 
          {todos.entries.map((entry) => <TodoEntry text={entry.text} todoId={todos.id} entryId={entry.id} crossOut={entry.crossedOut} backendUrl="http://127.0.0.1:5000/crossOutEntry/" todoList={todoList} setTodoList={setTodoList} indexInList={todos.index}/> )} </div>)}
        {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url="http://localhost:5000/addEntry/" todoId={currTodoId} submitCallBack={updateEntryList}/>
          <Button id="finishedAdding" buttonLabel="Done" height="200px" width="200px" onClick={todoAdded}/>
        </>} handleClose={popupClosed}></Popup>}
      </header>
    </div>
  );
}

export default App;
