import React from 'react';
import './Logo.css'
import logo from '../../assets/tearbw.svg';


function ShowLogo( {size} ) {

    let sizeClass = 'Logo-big';
    let divClass  = 'Logo-div-small';
    let titleClass = 'Logo-title';
    let logoTitle   = 'Churchyard page';

    switch (size) {
        case 'small-logo-only':
            sizeClass = 'Logo-small-only';
            titleClass  = 'Logo-title-invisible';
            break;
        case 'small':
            sizeClass = 'Logo-small';
            break;
        case 'medium':
            sizeClass = 'Logo-medium';
            divClass  += ' Logo-div-medium';
            break;
        case 'big':
            sizeClass = 'Logo-big';
            divClass  = 'Logo-div-big';
            break;
        default:
            console.error(`Unknown logo size ${size} found, using big`);
            break;
    }
    //console.log(`sizeClass = ${sizeClass}, divClass = ${divClass}` );

    return(
        <div className={divClass}>
            <img src={logo} className={sizeClass} alt="logo" title={logoTitle}/>
            <div className={titleClass}>Herdenk</div>
        </div>
    );
}

export default ShowLogo;