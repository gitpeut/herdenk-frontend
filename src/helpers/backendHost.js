function backendHost(){
    if ( process.env.REACT_APP_BACKEND === ''){
        console.error( "Backend host:port not defined as REACT_APP_BACKEND in .env");
    }else{
        console.log( "Host port is " + process.env.REACT_APP_BACKEND );
    }
    return( process.env.REACT_APP_BACKEND );
}

export default backendHost;