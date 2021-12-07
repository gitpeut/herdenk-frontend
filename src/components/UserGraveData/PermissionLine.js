import React from "react";
import './UserGraveData.css';
import accessToImage from "../../helpers/accessToImage";
import backendHost from "../../helpers/backendHost";
import axios from "axios";


function PermissionLine({reaction, parentUpdater}) {

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
            parentUpdater(result);
            return (result.data);
        } catch (e) {
            console.error(`Could not delete reaction ${e}`);
            return null;
        }
    }

    async function assessAccessRequest(e) {
        if (e === 'no') {
            await deleteRequest();
        }
        if (e === 'yes') {
            await allowAccess(reaction);
        }
    }

    function access2Title(access) {
        const accessToTitle = {
            READ: `Geef ${reaction.userName} leesrechten`,
            WRITE: `Geef ${reaction.userName} recht om reacties te plaatsen`,
            OWNER: `Maak ${reaction.userName} (mede)eigenaar van het graf`,
            NONE: `Verwijder alle rechten van ${reaction.userName}`,
        }
        return accessToTitle[access];
    }


    return (

        <li className="ug-li ug-permission">

            <span className="ug-user-span" key={`perm-span1-${reaction.reactionId}`}>{reaction.userName}</span>

            <span className="ug-permission-buttons">

                    <button key={`accessButton${reaction.reactionId}${reaction.type}`}
                            className="ug-button"
                            id={`request${reaction.reactionId}`}
                            onClick={() => assessAccessRequest('yes')}>

                             <img src={accessToImage(reaction.type)}
                                  className="ug-button-img"
                                  title={access2Title(reaction.type)}
                                  alt={access2Title(reaction.type)}
                             />
                    </button>

                    <button className="ug-button" id="cancel" onClick={() => assessAccessRequest('no')}
                            key={`no-${reaction.reactionId}`}>
                        <img className="ug-button-img" id="cancel-img" src={accessToImage("NO")} alt="afkeuren"
                             title="afkeuren"
                             key={`no-img-${reaction.reactionId}`}/>
                    </button>
                    </span>
        </li>

    );

}

export default PermissionLine;

