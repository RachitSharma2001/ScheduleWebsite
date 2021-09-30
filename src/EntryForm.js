import React from 'react';

class EntryForm extends React.Component {
    constructor(props) {
        super();
        this.state = {title: ""};
        this.url = props.url;

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event){
        event.preventDefault();
        let postUrl = this.url + this.state.title;
        console.log("Title: " + this.state.title);
        console.log("Posted url: " + postUrl);
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