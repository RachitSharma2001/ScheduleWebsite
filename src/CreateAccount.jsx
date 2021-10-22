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

    const userNotExist = (returnMessage, returnReason) => {
        return returnMessage == "fail" && returnReason == "email";
    }

    // Function called when user created
    const createUser = () => {

        // Check if user already exists
        let createUserUrl = givenUrl + "/user/" + email + "/" + password;
        fetch(createUserUrl, {method:"GET"}).then(res => res.json()).then(data => {
            console.log("Returned data from fetch: " + data.message + " " + data.reason);
            if(userNotExist(data.message, data.reason)){
                fetch(createUserUrl, {method:"POST"}).then(res => res.json()).then(data => {
                    // If sign up successful, tell user
                    setUserSignedUp(true);
                    setSignUpFail(false);
                });
            }else{
                setSignUpFail(true);
                setUserSignedUp(false);
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