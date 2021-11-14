import stone from '../../assets/png/stone_white.png';
import stone_private from '../../assets/stone_white_private.png';
import pen from '../../assets/png/edit.png';
import {Link} from "react-router-dom";
import './SummaryGrave.css';
import backendHost from "../../helpers/backendHost";
import axios from "axios";
import {useState} from "react";

// grave summary is an object like this:
// {
//     "graveId": 1,
//     "occupantFullName": "Napoleon Bonaparte",
//     "creationDate": "2021-11-09T23:00:00.000+00:00",
//     "access": "NONE"
// }


function SummaryGrave({grave}) {
    const [alreadyAsked, setAlreadyAsked] = useState(null);

    let access = true;
    let askWrite = false;
    if (grave.access === 'NONE') access = false;
    if (grave.access === 'PUBLIC' || grave.access === 'READ') askWrite = true;

    function displayAWhile( message ){
        setAlreadyAsked( message );
        setTimeout(() => { setAlreadyAsked(null)}, 8000);
    }

    async function postAccess( mode ) {

        const URL = `http://${backendHost()}/api/v1/reactions/permission/${grave.graveId}/${mode}`;
        const JWT = localStorage.getItem('herdenkToken');
        const config = {headers: {Authorization: 'Bearer ' + JWT}};

        try {
            // no useful output if it works
            await axios.post(URL, '', config);
        } catch (e) {
            if (e.response) {
                console.log('log message ', e.response.data.message,e.response);
                if ( e.response.status === 409 ) displayAWhile( 'Al in behandeling');
            }
            console.error(`Failed ask for write Access ${e}`);
        }
    }

    async function askWriteAccess (){
        await postAccess('WRITE');
    }

    async function askReadAccess (){
        await postAccess('READ');
    }

    return (
        <div className="sg-main">
            {access &&
            <Link to={`/grave/${grave.graveId}`}>
                <img src={stone}
                     className="sg-stone"
                     alt="Grafsteen"
                     title={`U heeft ${grave.access} toegang`}
                />
            </Link>
            }

            {!access &&
            <img src={stone_private}
                 className="sg-stone"
                 alt="Grafsteen"
                 title={`U heeft geen toegang tot dit graf. Klik om toegang te vragen`}
                 onClick={askReadAccess}
            />
            }
            <div className="sg-epitaph">{grave.occupantFullName}</div>

            { access && askWrite &&
            <img src={pen}
                 className="sg-askwrite"
                 alt="Vraag schrijfrecht"
                 title={`U kunt het graf wel bekijken,maar u mag geen reacties plaatsen. Klik voor toestemming om reacties te plaatsen`}
                 onClick={askWriteAccess}
            />
            }

            {alreadyAsked &&
            <div className="sg-above little-red">{alreadyAsked}</div>
            }
        </div>
    )


}

export default SummaryGrave;