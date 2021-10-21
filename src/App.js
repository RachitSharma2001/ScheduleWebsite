import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PublicNav from './PublicNav.jsx';
import PrivateNav from './PrivateNav.jsx';
import Home from './Home.jsx';
import SignUp from './CreateAccount.jsx';
import LogIn from './LogIn.jsx';



const clearToken = () => {
  console.log("Clear token called");
}

function App(){
  // Get the token that is stored in browser history
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  }

  // Set token saved in browser as react hook
  const [token, setToken] = useState(getToken());
  // Server url
  let backEndUrl = "http://localhost:5000/api";

  // Function called when user signs in successfully
  const saveToken = (userToken) => {
    // Store user information in browser
    localStorage.setItem('token', JSON.stringify(userToken));
    // Trigger react hook so page reloads to user home screen
    setToken(userToken);
  };

  // If the token does not exist, prompt the user to sign in
  if(!token){
    return (<div className="PublicView"> 
      <Router> 
        <PublicNav/> 
        <Route path="/todolist"> <LogIn backEndUrl={backEndUrl} saveTokenFunc={saveToken}/> </Route>
        <Route path="/signup"> <SignUp url={backEndUrl}/> </Route>
      </Router>
    </div>);
  }

  // If the token exists, show the home screen of the signed in user
  return (
    <div className="App">
      <Router>
        <PrivateNav />
        <Switch>
          <Route path="/todolist">
            <Home backEndUrl={backEndUrl} userId={token}/>
          </Route>
          <Route path="/signout">
            <p> Successfully logged out </p>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
