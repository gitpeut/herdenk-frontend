import NONE from "../assets/png/none.png";
import GOOD from "../assets/png/good.png";
import READ from "../assets/png/leesbril.png";
import WRITE from "../assets/png/edit.png";
import OWNER from "../assets/png/crown.png";
import PRIVATE from "../assets/png/private.png";
import PUBLIC from "../assets/png/public.png";

function accessToImage( access ){
    const imgMap =    {
        NONE : NONE,
        CANCEL : NONE,
        NO : NONE,
        GOOD : GOOD,
        YES : GOOD,
        READ : READ,
        WRITE : WRITE,
        OWNER : OWNER,
        PRIVATE: PRIVATE,
        PUBLIC: PUBLIC,
    };

    return  imgMap[access];
}

export default accessToImage;