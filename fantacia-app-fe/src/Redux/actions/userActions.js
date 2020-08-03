  
import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LOADING_UI,
    MARK_NOTIFICATIONS_READ,
    MARK_FRIEND_REQUEST_READ,
} from '../types';
import axios from 'axios';
  
export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/login', userData)
        .then((res) => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response ? err.response.data : err  
            });
        });
};
  
export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/signup', newUserData)
        .then((res) => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response ? err.response.data : err  
            });
        });
};
  
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .get('/user')
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
};

export const uploadAvatarImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .post('/user/uploadAvatar', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
};

export const uploadBackground = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .post('/user/background', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
};
   
export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios
        .post('/user/info', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
};
  
export const markNotificationsRead = (notificationIds) => (dispatch) => {
    axios
        .post('/notifications/read', notificationIds)
        .then((res) => {
            dispatch({
                type: MARK_NOTIFICATIONS_READ
            });
        })
      .catch((err) => console.log(err));
};
export const markFriendRequestRead = (requests) => dispatch => {
    axios
        .post('/friendRequests/read', requests)
        .then(res => {
            dispatch({
                type: MARK_FRIEND_REQUEST_READ
            })
        })
        .catch(err => console.log(err))
}
const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
};