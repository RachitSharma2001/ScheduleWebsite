import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {withRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp(props) {
    // React hook variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupSuccess, setUserSignedUp] = useState(false);
    const [signUpFail, setSignUpFail] = useState(false);
    // Given Server Side Url
    const givenUrl = props.url;

    // Function to check if data returned from server indicates
    // user exists or not
    const userNotExist = (returnMessage, returnReason) => {
        return returnMessage == "fail" && returnReason == "email";
    }

    // Function called when user created
    const createUser = () => {
        // Link to backend api
        let createUserUrl = givenUrl + "/user/" + email + "/" + password;
        // Get information about user from backend
        fetch(createUserUrl, {method:"GET"}).then(res => res.json()).then(data => {
            // Check if user already exists or not
            if(userNotExist(data.message, data.reason)){
                // If the user doesn't exist, create user
                fetch(createUserUrl, {method:"POST"}).then(res => res.json()).then(data => {
                    // Tell user sign up successful
                    setUserSignedUp(true);
                    // Make sure "Email already exists" doesn't show up
                    setSignUpFail(false);
                });
            }else{
                // Make sure "Sign up successful" message not shown
                setUserSignedUp(false);                
                // Tell user email already exists
                setSignUpFail(true);
            }
        });
    };

    // Function called when user types changes into email field
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    // Function called when user types changes into password field
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
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
            {signupSuccess && <p> You have successfully signed up! Now go and log in. </p>}
            </div>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {signUpFail && <p> Email already exists! </p>}
            </div>
            
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Button onClick={createUser} style={{marginTop:"30px", marginLeft: "100px", marginRight: "10px"}}> Create Account </Button>
            </div>
            
        </Form>
    );
}

export default withRouter(SignUp);