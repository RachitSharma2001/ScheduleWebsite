import React, { useState, useEffect } from 'react';
import Popup from './Popup.jsx';
import EntryForm from './EntryForm.jsx';
import TodoBox from './TodoBox.jsx';
import '../../App.css';
import './Popup.css';

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
  // Variable holding date of current todo
  let dateString = "";
  
  // Display the current todos right when user loads window
  useEffect(() => {
      updateTodos(todoList, setTodoList, todoUrl);
  }, []);

  const updateTodos = () => {
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

  // Renders popup to screen when user clicks to make a new todo
  const renderNewPopup = () => {
    fetch(todoUrl, {method: "POST"}).then(res => res.json()).then(data => {
        dateString = data.date;
        // update current todo id
        setTodoId(data.todoId.toString());
        // Wait for the todo id to be created before adding the todo
        setAddTodo(true);
    });
  }

  // Renders popup to screen when user decides to add an new entry to existing todo
  const renderExistingPopup = (todoId) => {
    setAddTodo(true);
    setTodoId(todoId);
  }

  // Closes an existing popup
  const closePopup = () => {
    dateString = "";
    setAddTodo(false);
    setEntryList([]);
  }

  // Edits entries on existing popup
  const updatePopupEntryList = (entryText) => {
      setEntryList(entryList => [...entryList, {id:entryList.length, text:entryText, crossedOut:false}])
  }

  const todoAdded = () => {
    // Close popup
    closePopup();
    // Call function to update the todos
    updateTodos(todoList, setTodoList, todoUrl);
  };

  // Function called when user clicks on entry to cross it out
  const entryCrossedOut = (indexInList, entryId) => {
    todoList[indexInList].entries[entryId].crossedOut = "line-through";
    setTodoList([...todoList]);
  }

  return (
      <div className="App">
      <header className="App-header">
          <button id="TodoAdd" style={{height: "60px", width: "200px", marginTop: "50px"}} onClick={renderNewPopup}> Add Todo </button>
          {todoList.map((todos) => <TodoBox todos={todos} entryUrl={entryUrl} entryCrossedOut={entryCrossedOut} 
            renderExistingPopup={renderExistingPopup}/>)}
          {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url={entryUrl} todoId={currTodoId} submitCallBack={updatePopupEntryList} todoAdded={todoAdded}/>
          </>} handleClose={closePopup}></Popup>}
      </header>
      </div>
  );
}
