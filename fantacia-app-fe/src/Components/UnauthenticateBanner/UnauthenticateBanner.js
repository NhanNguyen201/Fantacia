import React from 'react'
import AppIcon from '../../Img/fantacia.png';
import wellcomeBg from '../../Img/welcome.png';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './UnauthenticateBanner.scss';
export default function UnauthenticateBanner() {
    return (
        <div className='unauthenticate-banner' style={{backgroundImage: `url(${wellcomeBg})`}}>
            <img src={AppIcon} alt='App' className='app-icon'/>
            <div className='welcome-text-btn'>
                <p>Wellcome to <b className='app-name'>Fantacia</b></p>
                <div className='welcome-btn-container'>
                    <Button color="primary" component={Link} to='/login' variant="outlined" className='welcome-btn'>Login</Button>
                    <Button color="primary" component={Link} to='/signup' variant="outlined" className='welcome-btn'>Signup</Button>
                </div>
            </div>
        </div>
    )
}
