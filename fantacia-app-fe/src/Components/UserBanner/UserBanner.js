import React, { useRef } from 'react';
import PropTypes from 'prop-types';
//mui
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import MyRoundBtn from '../../Util/MyRoundBtn';
import { connect } from 'react-redux'; 
import { uploadAvatarImage } from '../../Redux/actions/userActions';
import './UserBanner.scss';
const  UserBanner = ({user, uploadAvatarImage}) => {
    const { credentials } = user;
    const avatarInput = useRef(null);
    const handleOpenInput = () => {
        avatarInput.current.click()
    } 
    const handleChangeAvatar = e => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        uploadAvatarImage(formData);
    }
    return(
        <div className="user-banner">
            <>
                <div className="user-info">
                    {credentials && 
                        <div className='avatar-container'>
                            <img src={credentials.imageUrl} alt="userAvatar" className="user-avatar"/>
                            <input hidden="hidden" type="file" onChange={handleChangeAvatar} ref={avatarInput}/>
                            <MyRoundBtn tip='Change your avatar' btnClassName='change-avatar-btn' onClick={handleOpenInput}>
                                <AccountCircleIcon color='primary' fontSize="large"/>
                            </MyRoundBtn>
                        </div>
                    }
                    {credentials && <p className="user-bio">{credentials.bio}</p>}
                </div>
                <div className="icon-container">
                    <MyRoundBtn tip="Edit your information" btnClassName="user-update-btn"><SettingsEthernetIcon color="secondary"/></MyRoundBtn>
                </div>
            </>
        </div>
    )
}
UserBanner.propTypes = {
    user: PropTypes.object.isRequired,
    uploadAvatarImage: PropTypes.func.isRequired
}
const mapStateToProp = state => ({
    user: state.user
})
export default connect(mapStateToProp, {uploadAvatarImage})(UserBanner)