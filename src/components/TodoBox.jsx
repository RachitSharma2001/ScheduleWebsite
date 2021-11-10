import {React, useState} from 'react';
import './TodoBox.css';
import './TodoEntry.css';

// Functional component defining particular entry of a Todolist
function TodoEntry(props){
    const { text, entryId, entryCrossedOut, crossOut, backendUrl, indexInList } = props;
    // If entry was crossed out, make appropriate request to backend
    const setCrossedOut = (e) => {
      fetch(backendUrl, {method:"PUT"});
      entryCrossedOut(indexInList, entryId);
    }
    // Render UI on screen
    return (<div> <button className="TodoEntry" style={{textDecoration:crossOut}} onClick={setCrossedOut}>{text}</button></div>)
}
  
export default function TodoBox(props){
    const { todos, entryUrl, entryCrossedOut, renderExistingPopup} = props;
  
    const makePopup = () => {
        renderExistingPopup(todos.id);
    }

    return (<div className="todoBordBox">
      <div>
        <b class="alignLeft"> {todos.date} </b>
        <button class="alignRight" onClick={makePopup}>+</button>
        <div style={{clear:"both"}}/>
      </div>
      <div>
        {todos.entries.map((entry) => <TodoEntry text={(entry.id+1) + ".  " + entry.text} entryId={entry.id} crossOut={entry.crossedOut} 
        entryCrossedOut={entryCrossedOut} backendUrl={entryUrl + "?todoId=" + todos.id + "&entryId=" + entry.id} 
        indexInList={todos.index}/> )} 
      </div>
    </div>);
}
  