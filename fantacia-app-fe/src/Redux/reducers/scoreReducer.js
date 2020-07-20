import  {
    SET_SCORE,
    CLEAR_SCORE,
    SCORE_LOADING,
    STOP_SCORE_LOADING,
} from '../types';

const initialState = {
    value: 0,
    loading: false
}


export default (state = initialState, action) => {
    switch(action.type) {
        case SET_SCORE: 
            return {
                value: action.payload.value,
                loading: false
            }
        case CLEAR_SCORE: 
            return initialState
        case SCORE_LOADING:
            return {
                ...state,
                loading: true
            }
        case STOP_SCORE_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}