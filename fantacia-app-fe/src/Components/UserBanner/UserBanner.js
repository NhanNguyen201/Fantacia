import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import defaultBg from '../../Img/background.png'
//mui
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';

import MyRoundBtn from '../../Util/MyRoundBtn';
//redux
import { connect } from 'react-redux'; 
import { uploadAvatarImage, uploadBackground } from '../../Redux/actions/userActions';
import './UserBanner.scss';
const  UserBanner = ({user, uploadAvatarImage, uploadBackground}) => {
    const { credentials } = user;
    const avatarInput = useRef(null);
    const backgroundInput = useRef(null);
    const handleOpenInput = () => {
        avatarInput.current.click()
    } 
    const handleChangeAvatar = e => {
        const image = e.target.files[0];
        const formData = new FormData();
        if(image){
            formData.append('image', image, image.name);
            uploadAvatarImage(formData);
        }
    }
    const handleChangeBackgroundOpen = () => {
        backgroundInput.current.click()
    }
    const handleChangeBackground = e => {
        const newBg = e.target.files[0];
        const formData = new FormData();
        if(newBg){
            formData.append('image', newBg, newBg.name);
            uploadBackground(formData)
        }
    }
    return(
        <div className="user-banner" style={{backgroundImage: credentials.background ? `url(${credentials.background})` : `url(${defaultBg})`}}>
            <>
                <div className="user-info">
                    {credentials && 
                        <div className='avatar-container'>
                            {credentials.imageUrl && 
                                <img src={credentials.imageUrl} alt="userAvatar" className="user-avatar"/>
                            }
                            <input hidden="hidden" type="file" onChange={handleChangeAvatar} ref={avatarInput}/>
                            <MyRoundBtn tip='Change your avatar' btnClassName='change-avatar-btn' onClick={handleOpenInput}>
                                <AccountCircleIcon color='primary' fontSize="large"/>
                            </MyRoundBtn>
                        </div>
                    }
                    {credentials && <p className="user-bio">{credentials.bio}</p>}
                </div>
                <div className="icon-container">
                    <MyRoundBtn tip="Change your background" btnClassName="bg-update-btn" onClick={handleChangeBackgroundOpen}>
                        <PhotoSizeSelectActualIcon color="primary"/>
                    </MyRoundBtn>
                    <input hidden="hidden" type="file" onChange={handleChangeBackground} ref={backgroundInput}/>
                    <MyRoundBtn tip="Edit your information" btnClassName="user-update-btn">
                        <SettingsEthernetIcon color="secondary"/>
                    </MyRoundBtn>
                </div>
            </>
        </div>
    )
}
UserBanner.propTypes = {
    user: PropTypes.object.isRequired,
    uploadAvatarImage: PropTypes.func.isRequired,
    uploadBackground: PropTypes.func.isRequired
}
const mapStateToProp = state => ({
    user: state.user
})
export default connect(mapStateToProp, {uploadAvatarImage, uploadBackground})(UserBanner)