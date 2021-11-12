
import React, {useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Profile from './pages/Profile/Profile';
import SignIn from './pages/User/SignIn';
import SignUp from './pages/User/SignUp';
import './App.css';
import PrivateRoute from "./components/PrivateRoute";
import {AuthContext} from "./context/AuthContext";
import './App.css';
import ShowLogo from "./components/Logo/Logo";
import Grave from "./pages/Grave/Grave";

function App() {
    const {loggedIn} = useContext(AuthContext);
    return (
        <>
            <NavBar/>
                <Switch>
                    <Route exact path="/">
                        <div className="content">
                        <ShowLogo size="big"/>
                        Welkom op Herdenk, een virtueel kerkhof.
                        </div>
                    </Route>
                    <PrivateRoute path="/profile" isAuthenticated={loggedIn}>
                        <div className="profile-content">
                        <Profile/>
                        </div>
                    </PrivateRoute>
                    <PrivateRoute path="/grave/:graveId" isAuthenticated={loggedIn}>
                        <div className="profile-content">
                            <Grave />
                        </div>
                    </PrivateRoute>
                    <Route exact path="/signin">
                        <div className="content">
                            <SignIn/>
                        </div>
                    </Route>
                    <Route exact path="/signup">
                        <div className="content">
                            <SignUp/>
                        </div>
                    </Route>
                </Switch>
        </>
    );
}

export default App;
