import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { emojify } from 'react-emojione';
// dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

import './Comment.scss';
const Comment = ({comment: {body, bio, userImage, userName, createdAt}}) => {
    const locale = {
        name: 'vi',
        relativeTime: {
            future: '%s from now',
            past: '%s ago',
            s: 'few seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'a hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        }
    }
    dayjs.locale(locale, null, true)    
    dayjs.extend(relativeTime);
    return (
        <div className="comment-paper">
            <img src={userImage} alt="comment-user-avatar" className="comment-avatar"/>
            <div className="comment-content">
                <p className="comment-body"><Link to={`/user/${userName}`} className="comment-link">{bio}</Link>  {emojify(body)}</p>
                <small>{dayjs(createdAt).fromNow()}</small>
            </div>
        </div>        
    )
}
Comment.propTypes = {
    comment: PropTypes.object.isRequired
}
export default Comment;

