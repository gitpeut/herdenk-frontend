import backendHost from "../../helpers/backendHost";
import axios from "axios";
import {Link} from "react-router-dom";
import stone from '../../assets/png/stone_white.png';
import {useState, useEffect} from "react";
import accessToTitle from "../../helpers/accessToTitle";
import '../GraveStone/GraveStone.css';

function GetFirstImage({grave}) {
    const [image, setImage] = useState(stone);
    const [pictureClass, setPictureClass] = useState('sg-stone');

    console.log('getfimage grave', grave);

    useEffect(() => {
        async function waitForReactions() {
            await getReactions(grave.graveId);
        }

        async function getImage(url) {
            let imageBlob;
            try {
                const JWT = localStorage.getItem('herdenkToken');
                // !response type  blob
                const config = {headers: {Authorization: 'Bearer ' + JWT}, responseType: 'blob'};

                imageBlob = (await axios.get(url, config)).data;
                setImage(URL.createObjectURL(imageBlob));
                setPictureClass('sg-picture');

            } catch (err) {
                console.error('Could not find image at ' + url);
                setImage(stone);
            }

        }

        async function getReactions(graveId) {

            if (grave.access === 'NONE') {
                setImage(stone);
                return;
            }

            try {
                //localhost:40545/api/v1/reactions/grave/3
                const JWT = localStorage.getItem('herdenkToken');
                const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};
                const reactionsURL = `http://${backendHost()}/api/v1/reactions/grave/${graveId}`;

                const result = await axios.get(reactionsURL, config);

                if (result) {
                    if (result.data.length === 0) return;

                    const firstImageURL = result.data.find(r => r.type === "MEDIA").mediaPath;
                    if (!firstImageURL) return;

                    await getImage(`http://${backendHost()}${firstImageURL}`);
                }
            } catch (e) {
                console.error(`No pictures found for grave ${graveId}: ${e}`);
                setImage(stone);
            }
        }

        waitForReactions();
    }, [grave]);

    const title = accessToTitle(grave.access);

    return (
        <>
            {grave.access !== "NONE" &&
            <Link to={`/grave/${grave.graveId}`}>
                <img src={image} alt={`Graf`} className={pictureClass} title={title}/>
            </Link>
            }
            {grave.access === "NONE" &&
            <img src={image} alt="Graf" className={pictureClass} title={title}/>
            }
        </>
    );
}

export default GetFirstImage;




