import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation.jsx';
import Home from './Home.jsx';
import SignUp from './CreateAccount.jsx';
import LogIn from './LogIn.jsx';



function App(){
  const [loginToken, setLoginToken] = useState("");
  const [loggedIn, setLogIn] = useState(false);
  let backEndUrl = "http://localhost:5000/api";

  // Procedure used to set up signing in of user
  const authUser = (userId) => {
    // Change the current user id, which will be passed in to new route
    setLoginToken(userId.toString());
    setLogIn(loggedIn => true);
    console.log("Login token: " + userId.toString());
    console.log("Login token value right now: " + loginToken);
  }

  useEffect(() => {
    console.log("Lets redirect, as loggedIn is: " + loggedIn);
    return <redirect to="/todolist"/>;
  }, [loggedIn]);
  
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          {loggedIn && <Route exact path='/todolist' exact component={() => <Home backEndUrl={backEndUrl} userId = "1"/>}/>}
          <Route exact path='/login' exact component={() => <LogIn authUser={authUser} backEndUrl={backEndUrl}/>}/>
          <Route exact path='/signup' exact component={() => <SignUp url={backEndUrl}/>}/>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
