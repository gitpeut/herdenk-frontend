import React, {useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import axios from "axios";
import backendHost from "../helpers/backendHost";

export const AuthContext = React.createContext({});





function AuthContextProvider({children}) {
    const [loginStatus, setLoginStatus] = useState({
        loggedIn: false,   // in stead of 'isAuth'
        user: null,
        userDetails: null,
        loginReady: false, // in stead of 'status'
        login: login,
        logout: logout,
    });


    useEffect(() => {
        async function waitForLogin() {
            await loginStatus.login();
        }
        waitForLogin();
    }, [] );


    async function getUserDetails( JWT ) {
        const rc = {success: false, result: null};
        try {
            const URL = `http://${backendHost()}/api/v1/users/me`;
            const config = {headers: {'Content-Type': 'application/json',Authorization: 'Bearer ' + JWT}};

            rc.result  = await axios.get(URL, config);
            rc.success = true;
            return( rc );
        } catch (e) {
            if ( e.response) {
                rc.success = false;
                rc.result = e.response.data;
            }
            return (rc);
        }
    }

    function testJWT( JWT ){
        let decodedToken;
        try {
            decodedToken = jwtDecode(JWT);
        } catch (e) {
            localStorage.removeItem('herdenkToken');
            return null;
        }
        return decodedToken;
    }

    function getJWT(){
        const JWT = localStorage.getItem('herdenkToken');
        let decodedToken = null;
        if ( JWT ) decodedToken = testJWT( JWT );

        if ( decodedToken === null ){
             const status = {
                 ...loginStatus,
                 loggedIn: false,
                 user: null,
                 userDetails: null,
                 loginReady: true,
             };
             setLoginStatus(status);
        }
        return( decodedToken ? JWT : null );
    }


    async function login(){

        const JWT = getJWT()
        if(  JWT === null ) return;

        const rc = await getUserDetails( JWT );

        if ( rc.success ) {
            const status = {
                ...loginStatus,
                userDetails: rc.result.data,
                user: rc.result.data.fullName,
                loggedIn: true,
                loginReady: true,
            };
            setLoginStatus(status);

        }
        return( rc.success);
    }


    function logout() {
        setLoginStatus({...loginStatus, loginStatus: false, userDetails: null, loginReady: true});
        localStorage.removeItem('herdenkToken');
    }

    return (
        <>
            {loginStatus.loginReady ?
                <AuthContext.Provider value={{...loginStatus}}>
                    {children}
                </AuthContext.Provider>
                : <p>Loading...{loginStatus.loginReady ? "true" : "false"}</p>
            }
        </>

    );

}

export default AuthContextProvider;

