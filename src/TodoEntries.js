import React from 'react';

class TodoEntries extends React.Component {
    constructor(props){
        super(props);
        console.log("props url, todoID: " + props.url + " " + props.todoId);

        this.state = {numEntries : 0};
        this.entryList = [];
        //this.entryForm = null;
        this.entryForm = new EntryForm(props.url, props.todoId);
        this.updateEntryList = this.updateEntryList.bind(this);
    }

    updateEntryList(entryText){
        this.entryList.add(entryText);
    }

    render() {
        return (
        <div> 
            <ul> {this.entryList.map(entry => {return <p> {entry} </p>})} </ul>
        </div>
        );
    }
}

export default TodoEntries;
