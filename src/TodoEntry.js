import React from 'react';

class TodoEntry extends React.Component {
    constructor(props){
        super();
        console.log(props.text + ", " + props.id)
        this.state = {text: props.text, todoId: props.todoId, entryId: props.entryId};

        this.entryCrossedOut = this.entryCrossedOut.bind(this);
    }

    entryCrossedOut(){
        console.log("Todo, entry id: " + this.state.todoId + " " + this.state.entryId);
    }

    render(){
        return (<div> <p> {this.state.text} </p> <button onClick={this.entryCrossedOut}>X</button></div>)
    }
}

export default TodoEntry;