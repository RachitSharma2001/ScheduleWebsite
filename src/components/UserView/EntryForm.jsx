import React from 'react';

export default function EntryForm(props){
    const { url, todoId, submitCallBack, todoAdded } = props;
    let title = "";
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Updating!")
        // Empty the input field
        document.getElementById("EntrySubmit").value="";
        submitCallBack(title);
        let postUrl = url + "?entryTitle=" + title + "&todoId=" + todoId;
        fetch(postUrl, {method: "POST"});
    }

    const handleTitleChange = (event) => {
        title = event.target.value;
    }

    return (<form onSubmit={handleSubmit}>
        <input type="Text" onChange={handleTitleChange} id="EntrySubmit"/>
        <input type="submit" value="+" style={{marginLeft: "30px"}} />
        <button id="finishedAdding" style={{height: "60px", width: "100px", marginTop: "20px"}} onClick={todoAdded}> Done </button>
    </form>);
}