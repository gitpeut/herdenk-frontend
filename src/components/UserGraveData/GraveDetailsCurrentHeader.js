import {useState} from "react";
import backendHost from "../../helpers/backendHost";
import axios from "axios";
import accessToImage from "../../helpers/accessToImage";


function GraveDetailsCurrentHeader({graveData, setUpdate}) {

    const publiclyAccessible = graveData.full.authorities.filter( a => a.userId === 0 && a.authority === 'PUBLIC').length;
    const [publicAccess, setPublicAccess] = useState( publiclyAccessible );

    async function makeGravePublic() {
            try {
                const JWT = localStorage.getItem('herdenkToken');
                const URL = `http://${backendHost()}/api/v1/authorities/grave/${graveData.full.graveId}/0/PUBLIC`;
                const config = {headers: {Authorization: 'Bearer ' + JWT}};

                const result = await axios.post(URL, '', config);

                if (result){
                    setPublicAccess( true );
                    console.log('Result of post authority', result);
                }
            } catch (e) {
                console.error(`Failed to make grave publicly accessible: ${e}`);
            }
    }

    async function makeGravePrivate() {
        try {
            const JWT = localStorage.getItem('herdenkToken');
            const URL = `http://${backendHost()}/api/v1/authorities/0/${graveData.full.graveId}`;
            const config = {headers: {Authorization: 'Bearer ' + JWT}};

            const result = await axios.delete(URL, config);

            if (result){
                setPublicAccess( false );
                console.log('Result of removing public access', result);
            }
        } catch (e) {
            console.error(`Failed to remove public access from grave: ${e}`);
        }
    }

    function togglePublic(){
        console.log('Toggle public checked');
        if ( publicAccess ){
            makeGravePrivate();
        }else{
            makeGravePublic();
        }
        setUpdate("public access changed");
    }

    let title = "Graf is voor iedereen zichtbaar. Klik om te veranderen.";
    if ( !publicAccess ) title = "Alleen toegankelijk na goedkeuring. Klik om te veranderen.";

    return(
        <li key='0header' className="ug-li ug-access ug-header"> <h6>Huidige toegangsrechten</h6>
            <button key={`button-0`}
                    className="ug-button" id="publicOrPrivate"
                    onClick={() => togglePublic()}>
                    <img className="ug-button-img" src={ accessToImage( publicAccess?"PUBLIC":"PRIVATE")} alt={title} title={title}/>
            </button>
    </li>
    );
}

export default GraveDetailsCurrentHeader;