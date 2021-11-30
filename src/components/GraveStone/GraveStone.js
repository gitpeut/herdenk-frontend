
import pen from '../../assets/png/edit.png';
import bril from '../../assets/png/leesbril.png';
import './GraveStone.css';
import backendHost from "../../helpers/backendHost";
import axios from "axios";
import {useState} from "react";
import GetFirstImage from "../GetFirstImage/GetFirstImage";

// grave summary is an object like this:
// {
//     "graveId": 1,
//     "occupantFullName": "Napoleon Bonaparte",
//     "creationDate": "2021-11-09T23:00:00.000+00:00",
//     "access": "NONE"
// }


function GraveStone({grave} ) {
    const [alreadyAsked, setAlreadyAsked] = useState(null);

    function displayAWhile(message) {
        setAlreadyAsked(message);
        setTimeout(() => {
            setAlreadyAsked(null)
        }, 8000);
    }

    async function postAccess(mode) {

        const URL = `http://${backendHost()}/api/v1/reactions/permission/${grave.graveId}/${mode}`;
        const JWT = localStorage.getItem('herdenkToken');
        const config = {headers: {Authorization: 'Bearer ' + JWT}};

        try {
            // no useful output if it works
            await axios.post(URL, '', config);
        } catch (e) {
            if (e.response) {
                //console.log('log message ', e.response.data.message, e.response);
                if (e.response.status === 409) displayAWhile('Al in behandeling');
            }
            console.error(`Failed ask for write Access ${e}`);
        }
    }

    async function askWriteAccess() {
        await postAccess('WRITE');
    }

    async function askReadAccess() {
        await postAccess('READ');
    }

    return (
        <div className="sg-main">

            <GetFirstImage grave={grave} />

            <div className="sg-epitaph">{grave.occupantFullName}</div>

            <div className="sg-pen">

                { (grave.access === 'READ' || grave.access === 'NONE' || grave.access === 'PUBLIC') &&
                <span>
                <img src={pen}
                     className="sg-askwrite"
                     alt="Vraag schrijfrecht"
                     title={`Klik voor toestemming om het graf te bekijken en reacties te plaatsen`}
                     onClick={askWriteAccess}/>
                </span>
                }
                {alreadyAsked &&
                <div className="sg-above">{alreadyAsked}</div>
                }
                { (grave.access !== 'OWNER' && grave.access !== 'WRITE' && grave.access !== 'PUBLIC' && grave.access !== 'READ') &&
                <span>
                    <img src={bril}
                     className="sg-askwrite"
                     alt="Vraag leesrecht"
                     title={`Klik voor toestemming het graf te bekijken. U wilt geen reacties plaatsen.`}
                     onClick={askReadAccess}/>
                </span>
                }
            </div>


        </div>
    )


}

export default GraveStone;