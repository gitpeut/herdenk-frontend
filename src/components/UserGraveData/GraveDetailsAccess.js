import PermissionLine from "./PermissionLine";
import React from "react";
import './UserGraveData.css'

function GraveDetailsAccess( {graveData, setUpdate} ) {

const graveId = graveData.full.graveId;

let displayHeader = 2;
return(

    <ul key={`ugpul${graveId}`} className="ug-ul">

        {   graveData.full &&
            graveData.full.reactions.map((r) => {
                if (r.type === 'READ' || r.type === 'WRITE') {
                    if ( displayHeader ) --displayHeader;
                    return (
                        <>
                            { displayHeader > 0 &&  <li key={0} className="ug-permission-li">Access requests</li> }
                            <PermissionLine key={r.reactionId} reaction={r}
                                            parentUpdater={setUpdate}/>
                        </>
                    )
                } else {
                    return null;
                }
            }
        )}
    </ul>
);
}

export default GraveDetailsAccess