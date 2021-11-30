import React from "react";
import './UserGraveData.css';
import accessToImage from "../../helpers/accessToImage";
import backendHost from "../../helpers/backendHost";
import axios from "axios";


function PermissionLine( {reaction, parentUpdater}){

    async function allowAccess() {
        const methods = ["put", "post"]
        for (let method in methods) {
            try {
                const JWT = localStorage.getItem('herdenkToken');
                // Add or change the access right to this grave for the requester
                const URL = `http://${backendHost()}/api/v1/authorities/grave/${reaction.graveId}/${reaction.userId}/${reaction.type}`;
                const config = {headers: {Authorization: 'Bearer ' + JWT}};

                let result;
                if (methods[method] === "put") {
                    result = await axios.put(URL, '', config);
                }
                if (methods[method] === "post") {
                    result = await axios.post(URL, '', config);
                }

                if (result) console.log('Result of post authority', result);
                await deleteRequest(reaction);
                break;
            } catch (e) {
                console.log(`Failed to set authority with ${methods[method]}, trying again : ${e}`);

            }
        }
    }

    async function deleteRequest() {
        try {
            const JWT = localStorage.getItem('herdenkToken');
                //Remove the request
                const URL = `http://${backendHost()}/api/v1/reactions/${reaction.reactionId}`;

                const result = await axios.delete(URL, {
                    headers:
                        {
                            Authorization: 'Bearer ' + JWT
                        }
                });
                parentUpdater( result);
                return( result.data );
        } catch (e) {
            console.error(`Could not delete reaction ${e}`);
            return null;
        }
    }

async function assessAccessRequest(e){
        if( e === 'no') {
        await deleteRequest();
    }
    if( e === 'yes') {
        await allowAccess( reaction );
    }
}

    return (

                <li className="ug-li ug-permission">
                    <span className="ug-user-span" key={`perm-span1-${reaction.reactionId}`}>{reaction.userName}</span>
                    <span className="ug-access-span" key={`perm-span2-${reaction.reactionId}`}>{reaction.type}</span>
                    <button className="ug-button" id="cancel" onClick={() => assessAccessRequest('no')}
                            key={`no-${reaction.reactionId}`}>
                        <img className="ug-button-img" id="cancel-img" src={accessToImage("NO")} alt="afkeuren" title="afkeuren"
                             key={`no-img-${reaction.reactionId}`}/>
                    </button>
                    <button className="ug-button" id="ok" onClick={() => assessAccessRequest('yes')}
                            key={`yes-${reaction.reactionId}`}>
                        <img className="ug-button-img" id="ok-img" src={ accessToImage("GOOD")} alt="goedkeuren" title="goedkeuren"
                             key={`yes-img-${reaction.reactionId}`}/>
                    </button>
                </li>

    );

}

export default PermissionLine;

