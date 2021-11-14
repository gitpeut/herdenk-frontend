import React, {useEffect, useState} from 'react';
import axios from "axios";

//from https://stackoverflow.com/questions/50344055/how-to-get-image-in-reactjs-from-api

function GetBlob({url, classname, blobKey}) {
    const [image, setImage] = useState({});

    useEffect(() => {
        async function getImage() {
            let imageBlob
            try {
                const JWT = localStorage.getItem('herdenkToken');

                imageBlob = (await axios.get(url,
                    {
                        headers:
                            {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + JWT
                            },
                        responseType: 'blob',
                    })).data;

            } catch (err) {
                return null;
            }
            setImage(URL.createObjectURL(imageBlob));
        }

        getImage();
    }, [url]);

    return <img src={image} alt={`plaatje`} className={classname} key={blobKey}/>
}

export default GetBlob;