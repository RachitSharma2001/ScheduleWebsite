import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PublicNav from './PublicNav.jsx';
import Home from './Home.jsx';
import SignUp from './CreateAccount.jsx';
import LogIn from './LogIn.jsx';
//import useToken from './useToken';

const getToken = () => {
  const tokenString = localStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken;
};

const saveToken = (userToken, setToken) => {
  console.log("Set token is called: " + userToken);
  localStorage.setItem('token', JSON.stringify(userToken));
  setToken(userToken);
};

function App(){
  const [token, setToken] = useState(getToken());
  let backEndUrl = "http://localhost:5000/api";

  if(!token){
    //console.log("Token seems undefined");
    return (<div className="PublicView"> 
      <Router> 
        <PublicNav/> 
        <Route path="/todolist"> <LogIn backEndUrl={backEndUrl} saveTokenFunc={saveToken} arg={setToken}/> </Route>
        <Route path="/signup"> <SignUp url={backEndUrl}/> </Route>
      </Router>
    </div>);
  }
  //console.log("Returning todolist instead");
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/todolist">
            <Home backEndUrl={backEndUrl} userId={token}/>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
