import PermissionLine from "./PermissionLine";
import React from "react";
import './UserGraveData.css'

function GraveDetailsAccessRequests({graveData, setUpdate} ) {

const graveId = graveData.full.graveId;

let displayRequestHeader = 2;
return(

            <ul key={`ugpul${graveId}`} className="ug-ul">

                {graveData.full &&
                graveData.full.reactions.map((r) => {
                        if (r.type === 'READ' || r.type === 'WRITE') {
                            if (displayRequestHeader) --displayRequestHeader;
                            return (
                                <>
                                    {(displayRequestHeader > 0) &&
                                    <li key={0} className="ug-li  ug-permission"><h6>Access requests</h6></li>}
                                    <PermissionLine key={r.reactionId} reaction={r} parentUpdater={setUpdate}/>
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

export default GraveDetailsAccessRequests