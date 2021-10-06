import React from 'react';

class EntryForm extends React.Component {
    constructor(props) {
        super();
        this.state = {title: ""};
        this.url = props.url;
        this.todoId = props.todoId;
        this.submitCallBack = props.submitCallBack;

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event){
        event.preventDefault();
        this.submitCallBack(this.state.title);
        let postUrl = this.url + this.state.title + "/" + this.todoId;
        fetch(postUrl, {method: "POST"}).then(res => res.json()).then(data => {
            console.log("Returned message: " + data.message);
        });
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
