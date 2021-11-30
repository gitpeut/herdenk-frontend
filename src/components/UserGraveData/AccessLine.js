import {useState} from "react";
import backendHost from "../../helpers/backendHost";
import accessToImage from "../../helpers/accessToImage";
import axios from "axios";

function AccessLine( {authority, setUpdate } ){

    const [ AuthError, setAuthError ] = useState( null );
    const allAuthorities = ['OWNER','WRITE', 'READ','NONE'];
    const displayAuthorities = allAuthorities.filter( value => value !== authority.access );


    async function updateAuthority( newAccess) {
            try {
                const JWT = localStorage.getItem('herdenkToken');
                // Add or change the access right to this grave for the requester
                const URL = `http://${backendHost()}/api/v1/authorities/grave/${authority.graveId}/${authority.userId}/${newAccess}`;
                const config = {headers: {Authorization: 'Bearer ' + JWT}};

                const result = await axios.put(URL, '', config);

                if (result){
                    console.log('Result of put authority', result);
                    setUpdate( result );
                }
            } catch (e) {
                if ( e.response ) {
                    displayAWhile( e.response.data.message );
                }
                console.error(`Failed to change authority: ${e}`);
            }
    }

    async function deleteAuthority() {
        try {
            const JWT = localStorage.getItem('herdenkToken');
            const URL = `http://${backendHost()}/api/v1/authorities/${authority.userId}/${authority.graveId}`;
            const config = {headers: {Authorization: 'Bearer ' + JWT}};

            const result = await axios.delete(URL, config);

            if (result){
                setUpdate( result);
                console.log('Result of removing access', result);
            }
        } catch (e) {
            if ( e.response ) {
               displayAWhile( e.response.data.message );
            }
            console.error(`Failed to remove access from grave: ${e}`);

        }
    }

    function displayAWhile(message) {
        setAuthError(message);
        setTimeout(() => {
            setAuthError(null)
        }, 8000);
    }


    async function assessAccessChange( newAccess ){

        if ( newAccess === authority.access )return;
        if ( newAccess === 'NONE'){
            await deleteAuthority();
            return;
        }
        await updateAuthority( newAccess );
    }

    function access2Title( access) {
        const accessToTitle = {
            READ: `Geef ${authority.userFullName} leesrechten`,
            WRITE: `Geef ${authority.userFullName} recht om reacties te plaatsen`,
            OWNER: `Maak ${authority.userFullName} (mede)eigenaar van het graf`,
            NONE:  `Verwijder alle rechten van ${authority.userFullName}`,
        }
        return accessToTitle[ access ];
    }

    return (
        <li className="ug-li ug-access">
            <span className="ug-user-span"
                          key={`AccessUser${authority.graveId}${authority.userId}`}>
                {authority.userFullName}
            </span>
            <span className="ug-access-span"
                  key={`AccessUserAccess${authority.graveId}${authority.userId}`}>
                {authority.access}
            </span>

            {displayAuthorities.map((a) => {
                    return (
                        <button key={`${a}accessButton${authority.graveId}${authority.userId}`}
                                className="ug-button" id={a}
                                onClick={() => assessAccessChange(a)}>
                            <img className="ug-button-img" src={accessToImage(a)} alt={access2Title(a)}
                                 key={`${a}buttonImage${authority.graveId}${authority.userId}`}
                                 title={access2Title(a)}/>
                        </button>
                    )
                }
            )
            }
            {AuthError &&
            <div className="ug-above" key={`AccessUserError${authority.graveId}${authority.userId}`}>{AuthError}</div>
            }
        </li>

    );


}

export default AccessLine;