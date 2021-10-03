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

  const updateEntryList = (todoId) => {
    /*const newList = entryList.slice();
    console.log("New list after slice: ");
    printList(newList);
    newList.push({id: entryList.length, text: entryText});
    console.log("New list after pushing item: ");
    printList(newList);
    setEntryList(newList);
    console.log("Now entry list length: " + entryList.length);*/
    console.log("Todo id passed in: " + todoId);
    fetch("http://localhost:5000/getEntries/" + todoId, {method: "GET"}).then(res => res.json()).then(data => {
      console.log("Message: " + data.EntryList);
      const newList = [];
      for(let i = 0; i < data.EntryList.length; i++){
        newList.push({id: i, text: data.EntryList[i]})
      }
      //printList(newList);
      setEntryList(newList);
      console.log("Entry list length after push: " + entryList.length);
    });
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
