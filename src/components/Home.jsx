import React, { useState, useEffect } from 'react';
import Popup from './Popup.jsx';
import EntryForm from './EntryForm.jsx';
import TodoBox from './TodoBox.jsx';
import '../App.css';
import './Popup.css';
import './TodoEntry.css';

// Function to update todolist
function updateTodos(todoList, setTodoList, todoUrl){
  console.log("The todo url: " + todoUrl);
  // Get all the todos and important information related to them
  fetch(todoUrl, {method: "GET"}).then(res => res.json()).then(data => {
      let tempTodoList = [];
      let numItemsAdded = 0;
      // Go through each todo from most recent to oldest
      for(let i = data.todoList.length-1; i >= 0; i--){
        let todoEntries = [];
        // Go through each entry and add it to this todo's entry
        for(let j = 0; j < data.todoList[i].length; j++){
          let crossedOut = "";
          if(data.todoList[i][j][1] == "True"){
            crossedOut = "line-through";
          }
          todoEntries.push({id: j, text: data.todoList[i][j][0], crossedOut: crossedOut});
        }
        // If the todo has no entry, no reason to add it
        if(todoEntries.length == 0) continue;
        // Add todo to the overall list and update the amount of items added
        tempTodoList.push({id: data.idList[i], entries: todoEntries, date: data.dateList[i], index: numItemsAdded});
        numItemsAdded++;
      }
      
      setTodoList(todoList => tempTodoList);
  });
}

export default function Home(props){
  // Boolean indicating if popup should show
  const [addTodo, setAddTodo] = useState(false); 
  // List of entries of the todo in the current popup windowd
  const [entryList, setEntryList] = useState([]);
  // List of entries for each todo
  const [todoList, setTodoList] = useState([]);
  // Current todo id (needed as a parameter to entryform)
  const [currTodoId, setTodoId] = useState("-1");
  // Variable holding user id
  const userId = props.userId;
  // Variable holding url of backend
  let baseApi = props.backEndUrl;
  // Variables holding important backend routes
  let todoUrl = baseApi + "/todos?userId=" + userId;
  let entryUrl = baseApi + "/entries"
  
  // Display the current todos right when user loads window
  useEffect(() => {
      updateTodos(todoList, setTodoList, todoUrl);
  }, []);

  const renderNewPopup = () => {
    fetch(todoUrl, {method: "POST"}).then(res => res.json()).then(data => {
        // update current todo id
        setTodoId(data.todoId.toString());
        // Wait for the todo id to be created before adding the todo
        setAddTodo(!addTodo);
    });
  }

  const renderExistingPopup = (todoId) => {
    setAddTodo(true);
    setTodoId(todoId);
  }

  const closePopup = () => {
    setAddTodo(false);
    setEntryList([]);
  }

  const updatePopupEntryList = (entryText) => {
      setEntryList(entryList => [...entryList, {id:entryList.length, text:entryText}])
  }

  const todoAdded = () => {
      // Close popup
      closePopup();
      // Call function to update the todos
      updateTodos(todoList, setTodoList, todoUrl);
  };

  const entryCrossedOut = (indexInList, entryId) => {
    todoList[indexInList].entries[entryId].crossedOut = "line-through";
    setTodoList([...todoList]);
  }

  return (
      <div className="App">
      <header className="App-header">
          <button id="TodoAdd" style={{height: "60px", width: "200px", marginTop: "50px"}} onClick={renderNewPopup}> Add Todo </button>
          {todoList.map((todos) => <TodoBox todos={todos}
          entryUrl={entryUrl} entryCrossedOut={entryCrossedOut} renderExistingPopup={renderExistingPopup}/>)}
          {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url={entryUrl} todoId={currTodoId} submitCallBack={updatePopupEntryList}/>
          <button id="finishedAdding" style={{height: "60px", width: "100px", marginTop: "20px"}} onClick={todoAdded}> Done </button>
          </>} handleClose={closePopup}></Popup>}
      </header>
      </div>
  );
}
