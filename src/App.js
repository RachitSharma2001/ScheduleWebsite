import React, { useState, useEffect } from 'react';
import Popup from './Popup.js';
import Button from './Button.js';
import EntryForm from './EntryForm.js';
import './App.css';
import './Popup.css';
import './TodoBox.css';
import './TodoEntry.css';

function updateTodos(todoList, setTodoList, todoUrl){
  // Get all the todos with greater than 0 entries
  // And update the todo and date list with them
  console.log("Going to make fetch to update todos using url: " + todoUrl);
  fetch(todoUrl, {method: "GET"}).then(res => res.json()).then(data => {
      let tempTodoList = [];
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
      
      setTodoList(todoList => tempTodoList);
  });
}

function updateTodoList(updatedList, setTodoList){
  setTodoList([...updatedList]);
}

function TodoEntry(props){
  const { text, todoId, entryId, crossOut, backendUrl, todoList, setTodoList, indexInList } = props;
  const setCrossedOut = (e) => {
    fetch(backendUrl + todoId + "/" + entryId, {method:"PUT"}).then(res => res.json()).then(data => {
      todoList[indexInList].entries[entryId].crossedOut = "line-through";
      updateTodoList(todoList, setTodoList);
    });
  }
  return (<div> <button className="TodoEntry" style={{textDecoration:crossOut}} onClick={setCrossedOut}> {entryId+1}.&nbsp;&nbsp;{text} </button></div>)
}


function App() {
  // Boolean indicating if popup should show
  const [addTodo, setAddTodo] = useState(false); 
  // List of entries of the todo in the current popup windowd
  const [entryList, setEntryList] = useState([]);
  // List of entries for each todo
  const [todoList, setTodoList] = useState([]);
  // Current todo id (needed as a parameter to entryform)
  const [currTodoId, setTodoId] = useState("-1");
  let baseApi = "http://localhost:5000/api";
  //let baseApi = "https://personal-daily-todolist.herokuapp.com/api";
  /*let addEntryUrl = baseApi + "/addEntry/";
  let addTodoUrl = baseApi + "/addTodo";
  let crossEntryUrl = baseApi + "/crossOutEntry/";
  let getTodoUrl = baseApi + "/getTodos"*/
  let todoUrl = baseApi + "/todo";
  let entryUrl = baseApi + "/entry/"
  
  // Display the current todos right when user loads window
  useEffect(() => {
    updateTodos(todoList, setTodoList, todoUrl);
  }, []);

  const popupClosed = () => {
    // If the todo button was clicked, create a new todo database object. Else Untoggle the popup
    if(!addTodo){
      fetch(todoUrl, {method: "POST"}).then(res => res.json()).then(data => {
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
    updateTodos(todoList, setTodoList, todoUrl);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <button id="TodoAdd" style={{height: "60px", width: "200px"}} onClick={popupClosed}> Add Todo for a day </button>
        
        {todoList.map((todos) => <div className="todoBordBox"> <b style={{alignItems: 'center'}}> {todos.date} </b> 
          {todos.entries.map((entry) => <TodoEntry text={entry.text} todoId={todos.id} entryId={entry.id} crossOut={entry.crossedOut} 
          backendUrl={entryUrl} todoList={todoList} setTodoList={setTodoList} 
          indexInList={todos.index}/> )} </div>)}
        {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url={entryUrl} todoId={currTodoId} submitCallBack={updateEntryList}/>
          <Button id="finishedAdding" buttonLabel="Done" height="200px" width="200px" onClick={todoAdded}/>
        </>} handleClose={popupClosed}></Popup>}
      </header>
    </div>
  );
}

export default App;
