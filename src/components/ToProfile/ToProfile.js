import React from 'react';
import './Account.css'
import head from '../../assets/account.svg';


function Account() {
    let divClass    = 'Account-div-small';
    const sizeClass = 'Account-small-only';
    const logoTitle = 'Persoonlijke gegevens';
    return(
        <div className={divClass}>
            <img src={head} className={sizeClass} alt="Naar persoonlijke gegevens" title={logoTitle}/>
        </div>
    );
}

export default Account();