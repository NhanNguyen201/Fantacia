import axios from 'axios';
import  {
    SET_SCORE,
    CLEAR_SCORE,
    SCORE_LOADING,
    STOP_SCORE_LOADING,
    SET_ERRORS,
    CLEAR_ERRORS,
} from '../types';


export const calcCompatible = userName => dispatch => {
    dispatch({ type: SCORE_LOADING })
    dispatch(clearErrors())
    axios
        .get(`/user/${userName}/calc`)
        .then(res => {
            dispatch({
                type: SET_SCORE,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
            dispatch({type: STOP_SCORE_LOADING})
        })
}


export const clearScore = () => dispatch => {
    dispatch({ type: CLEAR_SCORE })
}
export const clearErrors = () => (dispatch) =>  dispatch({ type: CLEAR_ERRORS })