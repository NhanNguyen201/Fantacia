  
import {
    SET_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_HID,
    UNLIKE_HID,
    JOIN_GROUP,
    LEAVE_GROUP,
    ANSWER_FRIEND_REQUEST,
    MARK_NOTIFICATIONS_READ,
    MARK_FRIEND_REQUEST_READ
} from '../types';
  
const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
    friendList: [],
    friendRequests: [],
};
  
export default function(state = initialState, action) {
switch (action.type) {
    case SET_AUTHENTICATED:
        return {
            ...state,
            authenticated: true
        };
    case SET_UNAUTHENTICATED:
        return initialState;
    case SET_USER:
        return {
            authenticated: true,
            loading: false,
            ...action.payload
        };
    case LOADING_USER:
        return {
            ...state,
            loading: true
        };
    case JOIN_GROUP:
        return {
            ...state,
            credentials: {
                ...state.credentials,
                groups: 
                [...state.credentials.groups, {
                    name: action.payload.name,
                    groupId: action.payload.groupId
                }]
            }
        }
    case LEAVE_GROUP:
        state.credentials.groups.filter(group => group !== action.payload)
        return state
    case LIKE_HID:
        return {
            ...state,
            likes: [
                ...state.likes,
                {
                    userName: state.credentials.userName,
                    hidId: action.payload.hidId,
                    hidHost: action.payload.hidHost
                }
            ]
        };
    case UNLIKE_HID:
        return {
            ...state,
            likes: state.likes.filter(
                (like) => like.hidId !== action.payload.hidId
            )
        };
    case ANSWER_FRIEND_REQUEST:
        if(action.payload.answer === "accept") state.friendList.push(action.payload.sender)
        return {
            ...state,
            friendRequests: state.friendRequests.filter(each => each.requestId !== action.payload.requestId)
        }; 
    case MARK_NOTIFICATIONS_READ:
        state.notifications.forEach((not) => (not.read = true));
        return {
            ...state
        };
    case MARK_FRIEND_REQUEST_READ:
        state.friendRequests.forEach(not => (not.read = true));
        return {...state};
    default:
        return state;
}
}