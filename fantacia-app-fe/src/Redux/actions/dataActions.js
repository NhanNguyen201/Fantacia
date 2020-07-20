import {
    SET_HIDS,
    CLEAR_HIDS,
    LOADING_DATA,

    LIKE_HID,
    UNLIKE_HID,
    DELETE_HID,
    SET_ERRORS,
    CLEAR_ERRORS,

    POST_HID,
    LOADING_UI,
    SET_HID,
    CLEAR_HID,

    SET_FOCUS_HID,
    CLEAR_FOCUS_HID,
    STOP_LOADING_UI,
    
    SET_GROUP,
    SET_GROUPS,
    CLEAR_GROUP,
    CLEAR_GROUPS,
    JOIN_GROUP,
    
    SET_FOCUS_PERSON,
    CLEAR_FOCUS_PERSON_INFO,
    LIKE_USER,
    UNLIKE_USER,
    SEND_FRIEND_REQUEST,
    ANSWER_FRIEND_REQUEST
} from '../types';
import axios from 'axios';

// Get all hids
export const getHids = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    dispatch(clearErrors());
    axios
        .get('/hids/all')
        .then((res) => {
            dispatch({
                type: SET_HIDS,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_HIDS,
                payload: []
            });
        });
};
export const getMyHids = () => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_DATA})
    axios
        .get('/hids/user')
        .then(res => {
            dispatch({
                type: SET_HIDS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })
}

export const getOneHid = hidId => dispatch => {
    dispatch({type: LOADING_UI, payload: hidId})
    axios
        .get(`/hid/${hidId}/get`)
        .then(res => {
            dispatch({
                type: SET_HID,
                payload: res.data
            })
            dispatch({type: STOP_LOADING_UI})
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })
}
export const getFocusHid = hidId => dispatch => {
    dispatch({type: LOADING_UI, payload: hidId})
    axios
        .get(`/hid/${hidId}/get`)
        .then(res => {
            dispatch({
                type: SET_FOCUS_HID,
                payload: res.data
            })
            dispatch({type: STOP_LOADING_UI})
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })
}
// Post a hid
export const postHid = (newHid, group) => (dispatch) => {
    dispatch(clearErrors());
    dispatch({ type: LOADING_UI });
    axios
        .post(`/group/${group}/hid`, newHid)
        .then((res) => {
            dispatch({
                type: POST_HID,
                payload: res.data
            });
            dispatch({type: STOP_LOADING_UI})
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
};
// Post a photo hid

export const postPhotoHid = (formData, group) => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_UI})
    axios
        .post(`/group/${group}/photoHid`, formData)
        .then(res => {
            dispatch({
                type: POST_HID,
                payload: res.data
            });
            dispatch({type: STOP_LOADING_UI})
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
}
//Post text status
export const postTextStatus = (newStatus) => (dispatch) => {
    dispatch(clearErrors());
    dispatch({ type: LOADING_UI });
    axios
        .post(`/status`, newStatus)
        .then((res) => {
            dispatch({
                type: POST_HID,
                payload: res.data
            });
            dispatch({type: STOP_LOADING_UI})
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
};
export const postPhotoStatus = (formData) => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_UI})
    axios
        .post(`/status/photo`, formData)
        .then(res => {
            dispatch({
                type: POST_HID,
                payload: res.data
            });
            dispatch({type: STOP_LOADING_UI})
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
}
// Like a hid
export const likeHid = (hidId) => (dispatch) => {
    axios
        .get(`/hid/${hidId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_HID,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
};
// Unlike a hid
export const unlikeHid = (hidId) => (dispatch) => {
    axios
        .get(`/hid/${hidId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_HID,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response   
            });
        });
};
// Submit a comment
export const submitComment = (hidId, commentData) => (dispatch) => {
    dispatch(clearErrors());
    dispatch({type: LOADING_UI, payload: hidId})
    axios
        .post(`/hid/${hidId}/comment`, commentData)
        .then((res) => {
            dispatch({
                type: SET_HID,
                payload: res.data
            });
            dispatch({type: STOP_LOADING_UI})
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
};
export const editHid = (hidId, body) => dispatch => {
    dispatch(clearErrors());
    dispatch({type: LOADING_UI, payload: hidId})
    axios
        .put(`/hid/${hidId}/edit`, body)
        .then((res) => {
            dispatch({
                type: SET_HID,
                payload: res.data
            });
            dispatch({type: STOP_LOADING_UI})
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
} 
export const deleteHid = (hidId) => (dispatch) => {
    dispatch(clearErrors());
    dispatch({type: LOADING_UI, payload: hidId})
    axios
        .delete(`/hid/${hidId}/delete`)
        .then(res => {
            dispatch({ type: DELETE_HID, payload: hidId });
            dispatch({type: STOP_LOADING_UI});
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
        });
};

export const getOneUser = (userName) => (dispatch) => {
    dispatch(clearErrors())
    dispatch({ type: LOADING_DATA });
    axios
        .get(`/user/${userName}/get`)
        .then((res) => {
            dispatch({
                type: SET_FOCUS_PERSON,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            });
            dispatch({ type: CLEAR_FOCUS_PERSON_INFO })
        });
};

export const exploreGroup = () => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_DATA})

    axios
        .get('/groups/explore')
        .then(res => {
            dispatch({
                type: SET_GROUPS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: CLEAR_GROUPS
            })
        })
}
export const getOneGroup = group => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_DATA})
    axios
        .get(`/hids/group/${group}/all`)
        .then(res => {
            dispatch({
                type: SET_GROUP,
                payload : res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
            // dispatch({type: CLEAR_GROUP})
        })
}

export const joinGroup = groupId => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_DATA})
    axios
        .get(`/group/${groupId}/join`)
        .then(res => {
            dispatch({
                type: JOIN_GROUP,
                payload: res.data
            })
        })
        .then(() => {
            dispatch(getOneGroup(groupId))
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })
}

export const likeUser = userName => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_UI})
    axios.get(`/user/${userName}/like`)
        .then(res => {
            dispatch({type: LIKE_USER})
        })
        .then(() => {
            dispatch({type: STOP_LOADING_UI})
        })
        .catch(err =>{
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const unlikeUser = userName => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_UI})
    axios.get(`/user/${userName}/unlike`)
        .then(res => {
            dispatch({type: UNLIKE_USER})
        })
        .then(() => {
            dispatch({type: STOP_LOADING_UI})
        })
        .catch(err =>{
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })

}

export const sendFriendRequest = userName => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_UI})
    axios.get(`/friend/${userName}/add`)
        .then(res => {
            dispatch({type: SEND_FRIEND_REQUEST})
        })
        .then(() => {
            dispatch({type: STOP_LOADING_UI})
        })
        .catch(err =>{
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })

}
export const answerFriendRequest = (requestId, answer, sender, curentFocusUserId = null) => dispatch => {
    dispatch(clearErrors())
    dispatch({type: LOADING_UI})
    axios.get(`/friend/${requestId}/${answer}`)
        .then(() => {
            if(answer === "accept" && sender === curentFocusUserId){
                dispatch(getOneUser(sender))
            }  
        })
        .then(() => {
            dispatch({
                type: ANSWER_FRIEND_REQUEST,
                payload: {
                    answer,
                    sender,
                    requestId
                }
            })
        })
        .then(() => {
            dispatch({type: STOP_LOADING_UI})
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response
            })
        })
}

export const clearHid = () => dispatch => dispatch({type: CLEAR_HID})
export const clearHids = () => dispatch => dispatch({type: CLEAR_HIDS});

export const clearGroups = () => dispatch => dispatch({type: CLEAR_GROUPS})
export const clearGroup = () => dispatch => dispatch({type: CLEAR_GROUP})

export const clearFocusHid = () => dispatch => dispatch({type: CLEAR_FOCUS_HID})
export const clearFocusPersonInfo = () => dispatch => dispatch({ type: CLEAR_FOCUS_PERSON_INFO })
export const clearErrors = () => (dispatch) =>  dispatch({ type: CLEAR_ERRORS })