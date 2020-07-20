import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { clearErrors, postPhotoHid } from '../../../Redux/actions/dataActions';

import MyRoundBtn from '../../../Util/MyRoundBtn';

//mui
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

const PostPhotoHid = ({group, postPhotoHid}) => {
    const photoHidInput = useRef(null)
    const handleImageChange = e => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        postPhotoHid(formData, group)
    }
    const handleOpenPost = () => {
        photoHidInput.current.click()
    }
    return (
        <>
            <input hidden="hidden" type="file" onChange={handleImageChange} ref={photoHidInput}/>
            <MyRoundBtn tip="Post a photo hid" onClick={handleOpenPost}>
                <AddPhotoAlternateIcon color="primary" fontSize="large"/>
            </MyRoundBtn>
        </>
    )
}

PostPhotoHid.propTypes = {
    postPhotoHid: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    group: state.data.group.groupId,
})

export default connect(mapStateToProps, {clearErrors, postPhotoHid})(PostPhotoHid);