import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { postPhotoStatus } from '../../../Redux/actions/dataActions';

import MyRoundBtn from '../../../Util/MyRoundBtn';

//mui
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

const PostPhotoStatus = ({ postPhotoStatus }) => {
    const photoStatusInput = useRef(null)
    const handleImageChange = e => {
        const image = e.target.files[0];
        const formData = new FormData();
        if(image){
            formData.append('image', image, image.name);
            postPhotoStatus(formData)
        }
    }
    const handleOpenPost = () => {
        photoStatusInput.current.click()
    }
    return (
        <>
            <input hidden="hidden" type="file" onChange={handleImageChange} ref={photoStatusInput}/>
            <MyRoundBtn tip="Post a photo status" onClick={handleOpenPost}>
                <AddPhotoAlternateIcon color="primary" fontSize="large"/>
            </MyRoundBtn>
        </>
    )
}

PostPhotoStatus.propTypes = {
    postPhotoStatus: PropTypes.func.isRequired
}


export default connect(null, {postPhotoStatus})(PostPhotoStatus);