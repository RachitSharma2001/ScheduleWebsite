import React from 'react';

export default function EntryForm(props){
    const { url, todoId, submitCallBack } = props;
    let title = "";
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Updating!")
        // Empty the input field
        document.getElementById("EntrySubmit").value="";
        submitCallBack(title);
        let postUrl = url + title + "/" + todoId;
        fetch(postUrl, {method: "POST"}).then(res => res.json()).then(data => {
            console.log("Returned message: " + data.message);
        });
    }

    const handleTitleChange = (event) => {
        title = event.target.value;
    }

    return (<form onSubmit={handleSubmit}>
        <input type="Text" onChange={handleTitleChange} id="EntrySubmit"/>
        <input type="submit" value="+" style={{marginLeft: "30px"}} />
    </form>);
}