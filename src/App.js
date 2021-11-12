
import React, {useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './App.css';
import PrivateRoute from "./components/PrivateRoute";
import {AuthContext} from "./context/AuthContext";
import './App.css';
import ShowLogo from "./components/Logo/Logo";

function App() {
    localStorage.removeItem('token');// if an invalid token was saved,this prevents crashes
    const {loggedIn} = useContext(AuthContext);
    return (
        <>
            <NavBar/>
            <div className="content">
                <Switch>
                    <Route exact path="/">
                        <ShowLogo size="big"/>
                        Welkom op Herdenk, een plaats voor herinneringen.
                    </Route>
                    <PrivateRoute path="/profile" isAuthenticated={loggedIn}>
                        <Profile/>
                    </PrivateRoute>
                    <Route exact path="/signin">
                        <SignIn/>
                    </Route>
                    <Route exact path="/signup">
                        <SignUp/>
                    </Route>
                </Switch>
            </div>
        </>
    );
}

export default App;
