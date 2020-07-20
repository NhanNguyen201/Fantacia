import {
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    STOP_LOADING_UI,
} from '../types';
  
  const initialState = {
    loading: false,
    errors: null,
    target: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_ERRORS:
        return {
          ...state,
          loading: false,
          errors: action.payload
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          loading: false,
          errors: null,
          target: null
        };
      case LOADING_UI:
        return {
          ...state,
          loading: true,
          target: action.payload ? action.payload : null
        };
      case STOP_LOADING_UI:
        return {
          ...state,
          loading: false,
          target: null
        };
      
      default:
        return state;
    }
  }