import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PublicNav from './PublicNav.jsx';
import Home from './Home.jsx';
import SignUp from './CreateAccount.jsx';
import LogIn from './LogIn.jsx';

function App(){
  const [token, setToken] = useState();
  let backEndUrl = "http://localhost:5000/api";

  if(!token){
    return (<div className="PublicView"> 
      <Router> 
        <PublicNav/> 
        <Route path="/todolist"> <LogIn backEndUrl={backEndUrl} setToken={setToken}/> </Route>
        <Route path="/signup"> <SignUp url={backEndUrl}/> </Route>
      </Router>
    </div>);
  }

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
