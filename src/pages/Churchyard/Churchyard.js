import {useContext, useState, useEffect} from 'react';
import {AuthContext} from "../../context/AuthContext";
import backendHost from "../../helpers/backendHost";
import axios from "axios";
import GraveStone from "../../components/GraveStone/GraveStone";
import './Churchyard.css';

function Churchyard() {
    const {loggedIn} = useContext(AuthContext);
    const [graveSummary, setGraveSummary] = useState( null);

    useEffect(
        () => {
            async function waitForSummary(){
                await getGraveSummary();
            }
            waitForSummary();
        }, []
    );

    async function getGraveSummary() {
        try {
            const URL = `http://${backendHost()}/api/v1/graves/summary`;
            const JWT = localStorage.getItem('herdenkToken');
            const config = {headers: {Authorization: 'Bearer ' + JWT}};

            const result = await axios.get(URL, config);

            if (result) setGraveSummary(result.data);
        } catch (e) {
            console.error(`Failed to get the summary ${e}`);
        }
    }



    return(
        <div className="ch-main">
            {graveSummary && loggedIn &&

            graveSummary.map((grave) => {
                return (
                        <GraveStone grave={grave} key={`ch${grave.graveId}`}/>
                );
            })
            }
        </div>

);



}
export default Churchyard;

// <div className="ch-grave" key={`chdiv${grave.graveId}`}>
// </div>
