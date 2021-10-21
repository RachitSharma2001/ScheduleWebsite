import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {withRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const givenUrl = props.url;
    const createUser = () => {
        let createUserUrl = givenUrl + "/user/" + email + "/" + password;
        fetch(createUserUrl, {method:"POST"}).then(res => res.json()).then(data => {
            console.log("Returned Message: " + data.message);
        });
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        console.log("Email: " + email);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        console.log("Password: " + password);
    }

    return (
        <Form>
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Form.Group className="mb-3" controlId="formBasicEmail" style={{width: "500px", marginTop:"30px", marginLeft: "100px", marginRight: "100px"}}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChange}/>
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Form.Group className="mb-3" controlId="formBasicPassword" style={{width: "500px", marginTop:"30px", marginLeft: "100px", marginRight: "100px"}}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} />
            </Form.Group>
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Button onClick={createUser} style={{marginTop:"30px", marginLeft: "100px", marginRight: "10px"}}> Create Account </Button>
            </div>
        </Form>
    );
}

export default withRouter(SignUp);