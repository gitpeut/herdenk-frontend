import React, {useEffect, useState} from "react";
import './UserGraveData.css'
import backendHost from "../../helpers/backendHost";
import axios from "axios";
import GraveDetailsCurrentHeader from "./GraveDetailsCurrentHeader";
import AccessLine from "./AccessLine";



function GraveDetailsCurrentAccess({graveData, update, setUpdate} ) {
    const [authorities, setAuthorities] = useState([]);
    const graveId = graveData.full.graveId;


    useEffect(
        ()=> {
            async function getGraveAuthorities() {
                try {
                    const JWT = localStorage.getItem('herdenkToken');
                    const URL = `http://${backendHost()}/api/v1/authorities/grave/${graveId}/names`;
                    const config = {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JWT}}
                    const result = await axios.get(URL, config);

                    setAuthorities(result.data);
                } catch (e) {
                    console.error(`Could not find authorities ${e}`);
                }
            }

            async function waitForAuthorities(){
                await getGraveAuthorities();
            }

            waitForAuthorities();
        }, [ update, graveId ]);


    let displayRequestHeader = 2;
    return (
            <ul key={`ulistCurrent${graveId}`} className="ug-ul">
                {graveData.full && authorities &&
                authorities.map((a) => {
                    if (displayRequestHeader) --displayRequestHeader;
                    return (
                        <>
                            {(displayRequestHeader > 0) &&
                            <GraveDetailsCurrentHeader key={`header${a.userId}${a.graveId}`} graveData={graveData}
                                                       setUpdate={setUpdate}/>
                            }

                            <AccessLine key={`accessLine${a.userId}${a.graveId}`} authority={a} setUpdate={setUpdate}/>
                        </>
                    )
                })
                }
            </ul>
    )
}

export default GraveDetailsCurrentAccess;