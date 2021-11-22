import stone from '../../assets/png/stone_white.png';
import stone_private from '../../assets/stone_white_private.png';
import pen from '../../assets/png/edit.png';
import bril from '../../assets/png/leesbril.png';
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
                console.log('log message ', e.response.data.message, e.response);
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
            { grave.access !== 'NONE' &&
            <Link to={`/grave/${grave.graveId}`}>
                <img src={stone}
                     className="sg-stone"
                     alt="Grafsteen"
                     title={`U heeft ${grave.access} toegang`}
                />
            </Link>
            }

            {grave.access === 'NONE' &&
            <img src={stone_private}
                 className="sg-stone"
                 alt="Grafsteen"
                 title={`U heeft geen toegang tot dit graf. Klik om lees toegang te vragen`}
            />
            }

            <div className="sg-epitaph">{grave.occupantFullName}</div>

            <div className="sg-pen">

                { (grave.access === 'READ' || grave.access === 'NONE') &&
                <span>
                <img src={pen}
                     className="sg-askwrite"
                     alt="Vraag schrijfrecht"
                     title={`Klik voor toestemming om het graf te bekijken en reacties te plaatsen`}
                     onClick={askWriteAccess}/>
                </span>
                }
                <span>
                { (grave.access !== 'OWNER' && grave.access !== 'WRITE') &&
                    <img src={bril}
                     className="sg-askwrite"
                     alt="Vraag leesrecht"
                     title={`Klik voor toestemming het graf te bekijken. U wilt geen reacties plaatsen.`}
                     onClick={askReadAccess}/>
                }
                </span>
            </div>

            {alreadyAsked &&
            <div className="sg-above little-red">{alreadyAsked}</div>
            }
        </div>
    )


}

export default SummaryGrave;