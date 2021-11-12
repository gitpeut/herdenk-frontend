import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';

function PrivateRoute({path, isAuthenticated, children}) {
    if (!isAuthenticated) {
//        console.log("NOT LOGGED IN");
        return <Redirect to="/"/>;
    }
//    console.log("logged in");

    // mind the double {{ curlies around children:
    // one set for the spread of the children, one set
    // for React to unpack and display whatever the spread produced
    return (
        <Route path={path}>
            {{...children}}
        </Route>
    );
}

export default PrivateRoute