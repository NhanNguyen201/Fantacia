import React from 'react'
import PropTypes from 'prop-types'
import LikeListItem from '../LikeListItem/LikeListItem';
export default function LikeList({ likeList }) {
    var markup;
    if(likeList && likeList.length > 0){
        markup = likeList.map(like => <LikeListItem likeItem={like} key={like.likeId}/>)
    } else {
        markup = <p>There is no like</p>
    }
    return markup;
}
LikeList.propTypes = {
    likeList: PropTypes.array
}
