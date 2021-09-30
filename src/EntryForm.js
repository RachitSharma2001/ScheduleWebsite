import React from 'react';

class EntryForm extends React.Component {
    constructor(props) {
        super();
        this.state = {title: ""};

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event){
        event.preventDefault();
        
    }
    handleTitleChange(event){
        this.setState({title: event.target.value});
    }
    render() {
        return (<form onSubmit={this.handleSubmit}>
            <input type="Text" onChange={this.handleTitleChange}/>
            <input type="submit" value="Submit"/>
        </form>);
    };
}
export default EntryForm;