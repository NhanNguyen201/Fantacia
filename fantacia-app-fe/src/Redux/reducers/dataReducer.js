import {
    SET_HIDS,
    CLEAR_HIDS,
    LIKE_HID,
    UNLIKE_HID,
    LOADING_DATA,
    DELETE_HID,
    POST_HID,
    SET_HID,
    SET_FOCUS_HID,
    CLEAR_FOCUS_HID,
    
    SET_GROUPS,
    CLEAR_GROUPS,
    SET_GROUP,
    CLEAR_GROUP,
    
    SET_ERRORS,
    
    SET_FOCUS_PERSON,
    CLEAR_FOCUS_PERSON_INFO,
    
    LIKE_USER,
    UNLIKE_USER,
    SEND_FRIEND_REQUEST,
    ANSWER_FRIEND_REQUEST,
} from '../types';

const initialState = {
    hids: [],
    focusHid: {},
    focusPerson : {},
    groups: [],
    group: {},
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA: {
            return {
                ...state,
                loading: true
            };
        }
        case SET_HIDS: {
            return {
                ...state,
                hids: action.payload,
                loading: false
            };
        }
        case CLEAR_HIDS: {
            return {
                ...state,
                hids: []
            }
        }
        case SET_HID: {
            let setIndex = state.hids.findIndex(
                (hid) => hid.hidId === action.payload.hidId
            );
            state.hids[setIndex] = {...state.hids[setIndex], ...action.payload};
            if (state.focusHid.hidId === action.payload.hidId) {
                state.focusHid = {...state.focusHid, ...action.payload};
            }
            return {
                ...state
            };
        }
        case SET_FOCUS_HID: {
            let setIndex = state.hids.findIndex(
                (hid) => hid.hidId === action.payload.hidId
            );
            state.hids[setIndex] = {...state.hids[setIndex], ...action.payload};
            return {
                ...state,
                focusHid: action.payload
            }
        }
        case CLEAR_FOCUS_HID: {
            return {
                ...state,
                focusHid: {}
            }
        }
        case LIKE_HID: 
        case UNLIKE_HID: {
            let likeIndex = state.hids.findIndex(
                (hid) => hid.hidId === action.payload.hidId
            );
            state.hids[likeIndex] = {...state.hids[likeIndex], ...action.payload};
            if (state.focusHid.hidId === action.payload.hidId) {
                state.focusHid = {...state.focusHid, ...action.payload};
            }
            return {
                ...state
            };
        }
        case DELETE_HID: {
            let deleteIndex = state.hids.findIndex(
                (hid) => hid.hidId === action.payload
            );
            state.hids.splice(deleteIndex, 1);
            return {
                ...state
            };
        }
        case POST_HID: {
            return {
                ...state,
                hids: [action.payload, ...state.hids]
            };        
        }
        case SET_GROUPS: {
            return {
                ...state,
                groups: action.payload,
                loading: false
            }
        }
        case CLEAR_GROUPS: {
            return {
                ...state,
                groups: [],
                loading: false
            }
        }
        case SET_GROUP: {
            let { hids, ...groupData} = action.payload
            return {
                ...state,
                hids: hids,
                group: groupData,
                loading: false
            }
        }
        case CLEAR_GROUP: {
            return {
                ...state,
                group: {},
                loading: false
            }
        }
        case SET_FOCUS_PERSON: {
            let { hids, ...userData } = action.payload;
            return {
                ...state,
                hids: hids,
                focusPerson: userData,
                loading: false
            }
        }
        case CLEAR_FOCUS_PERSON_INFO: {
            return {
                ...state,
                focusPerson: {}
            }
        }
        case LIKE_USER: {
            return {
                ...state,
                focusPerson: {
                    ...state.focusPerson,
                    isLiked: true
                }
            }
        }
        case UNLIKE_USER: {
            return {
                ...state,
                focusPerson: {
                    ...state.focusPerson,
                    isLiked: false
                }
            }
        }
        case SET_ERRORS: {
            return {
                ...state,
                loading: false
            }
        }
        case SEND_FRIEND_REQUEST: {
            return {
                ...state,
                focusPerson: {
                    ...state.focusPerson,
                    isRequested: true
                }
            }
        }
        case ANSWER_FRIEND_REQUEST:  {
            if(state.focusPerson && (action.payload.answer === "deny" && state.focusPerson.userInfo.userName === action.payload.sender)) state.focusPerson.isRequestToUs = false
            return {
                ...state
            }
        }
        default:
           return state;
    }
}