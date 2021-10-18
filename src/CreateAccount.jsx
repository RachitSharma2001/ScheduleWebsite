import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChange}/>
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} />
            </Form.Group>

            <Button onClick={createUser}> Create Account </Button>
        </Form>
    );
}

export default SignUp;