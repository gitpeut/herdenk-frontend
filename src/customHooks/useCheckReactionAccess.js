import {useContext,useState,useEffect} from "react";
import {AuthContext} from "../context/AuthContext";
import backendHost from "../helpers/backendHost";
import axios from "axios";

// reaction looks like this:
// {
//     "reactionId": 1,
//     "graveId": 3,
//     "userId": 3,
//     "userName": "Toffe Peer",
//     "type": "TEXT",
//     "creationDate": "2021-11-11T10:44:16.286+00:00",
//     "text": "Zing allemaal mee",
//     "mediaPath": null
// }

//grave summary looks like this
// {
//     "graveId": 3,
//     "occupantFullName": "Zangeres zonder Naam",
//     "creationDate": "2021-11-07T23:00:00.000+00:00",
//     "access": "OWNER"
// }


function useCheckReactionAccess( reaction ){
const [ canChange, setCanChange] = useState( false );
const {user} = useContext(AuthContext);

    useEffect(() => {

        async function getGraveSummary(){
            try {
                //http://localhost:40545/api/v1/graves/summary/3
                const JWT = localStorage.getItem('herdenkToken');
                const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};
                const graveURL = `http://${backendHost()}/api/v1/graves/summary/${reaction.graveId}`;

                const result = await axios.get(graveURL, config);

                if (result) {
                    console.log('graveId ', reaction.graveId, ' result ', result);
                    if (result.data.length === 0) {
                        setCanChange( false );
                        return;
                    }
                    if ( result.data.access === 'OWNER' ) setCanChange( true );

                }
            } catch (e) {
                console.error(`Could not get grave data ${e}`);
                setCanChange( false );
            }
        }

        async function waitForGraveSummary(){
            await getGraveSummary();
        }

        if ( reaction.reactionId === 'new' || user === reaction.userName){
            setCanChange( true );
        }else{
            waitForGraveSummary();
        }

    }, [reaction, user]);

    return canChange;
}

export default useCheckReactionAccess;