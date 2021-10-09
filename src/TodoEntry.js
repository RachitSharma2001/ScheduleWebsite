import React from 'react';

class TodoEntry extends React.Component {
    constructor(props){
        super();
        this.state = {text: props.text, todoId: props.todoId, entryId: props.entryId, crossOut: props.crossOut};

        this.backendUrl = props.backendUrl;
        this.entryCrossedOut = this.entryCrossedOut.bind(this);
    }

    entryCrossedOut(){
        this.setState({crossOut:"line-through"});
        fetch(this.backendUrl + this.state.todoId + "/" + this.state.entryId, {method:"POST"});
    }

    render(){
        return (<div> <p style={{textDecoration:this.state.crossOut}}> {this.state.text} </p> <button onClick={this.entryCrossedOut}>X</button></div>)
    }
}

export default TodoEntry;