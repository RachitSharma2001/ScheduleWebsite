import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LogIn(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Function called when user changes content of email field
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    // Function called when user changes content of password field
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    // Function called when user clicks sign in button
    const authenticateUser = () => {
        // Call backend to verify if user exists
        fetch(props.backEndUrl + "/user/" + email + "/" + password).then(res => res.json()).then(data => {
            // Check if user exists
            if(data.message == "fail"){
                // Entered email or password is incorrect
                console.log("Wrong Email or Password");
            }else{
                // Call parent function, which will redirect client
                props.saveTokenFunc(data.userId);
            }
        });
    }

    return (
        <header className="logInHeader">
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
            <Button onClick={authenticateUser} style={{marginTop:"30px", marginLeft: "100px", marginRight: "10px"}}> Sign In </Button>
            </div>
            
        </Form>
        </header>
        
    );
}