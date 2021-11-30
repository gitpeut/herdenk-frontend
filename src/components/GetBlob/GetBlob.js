import React, {useEffect, useState} from 'react';
import axios from "axios";

//from https://stackoverflow.com/questions/50344055/how-to-get-image-in-reactjs-from-api

function GetBlob({url, classname, blobKey}) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        async function getImage() {
            let imageBlob
            try {
                const JWT = localStorage.getItem('herdenkToken');

                imageBlob = (await axios.get( url,
                    {
                        headers:
                            {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + JWT
                            },
                        responseType: 'blob',
                    })).data;

                 setImage(URL.createObjectURL(imageBlob));

            } catch (err) {
                return null;
            }
        }

        async function waitForImage(){
            await getImage();
        }

        waitForImage();
    }, [url]);

    return (
        <img src={image} alt={`plaatje`} className={classname} key={blobKey}/>
    );
}

export default GetBlob;