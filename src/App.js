import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Popup from './Popup.js';
import Button from './Button.js';
import EntryForm from './EntryForm.js';
import './App.css';
import './Popup.css';

function App() {
  const [addTodo, setAddTodo] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  const [entryList, setEntryList] = useState([]);

  const toggleAddTodo = () => {
    // If the todo button was clicked, create a new todo database object
    if(!addTodo){
      fetch("http://localhost:5000/addTodo", {method: "POST"}).then(res => res.json()).then(data => {
        //console.log("The todo id: " + data.message);
      });
    }
    setAddTodo(!addTodo);
  };

  const printList = (list) => {
    console.log("List length: " + list.length);
    for(let i = 0; i < list.length; i++){
      console.log(list[i].id + " " + list[i].text);
    }
  }

  const updateEntryList = (entryText) => {
    console.log("Entry list length: " + entryList.length);
    setEntryList(entryList => [...entryList, {id:entryList.length, text:entryText}])
  }

  const toggleAddEntry = () => {
    setAddEntry(!addEntry);
  };

  /*useEffect(() =>{
    fetch("http://localhost:5000/getEntries/1").then(res => res.json()).then(data => {
      console.log("Returned message: " + data.EntryList);
    });
  });*/
  
  return (
    <div className="App">
      <header className="App-header">
        <Button id="TodoAdd" buttonLabel="Add Todo for a day" height="200px" width="200px" onClick={toggleAddTodo}></Button>
        
        {addTodo && <Popup content={<>
          <ul> {entryList.map((entry) => <li key = {entry.id}> {entry.text} </li>)} </ul>
          <EntryForm url="http://localhost:5000/addEntry/" todoId="2" submitCallBack={updateEntryList}/>
        </>} handleClose={toggleAddTodo}></Popup>}
      </header>
    </div>
  );
}

export default App;
