import React from 'react';
import { connect } from "react-redux";
import { PLAY_CARD } from "../actions/constants";

export default function Card(props) {
  return (
    // <button onClick={() => props.onCardPlayed(props.item)}>{props.item}</button>
    <img 
    onClick={props.myClick}
    src={props.src}
    width='100px'
    />
  )
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//       onCardPlayed: (card) =>
//         dispatch({ type: PLAY_CARD, payload: { cardPlayed: card } }),
//     };
//   };

// export default connect(null, mapDispatchToProps)(Card);
