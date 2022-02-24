import React from "react";
import { Link } from "react-router-dom";
import { START_GAME } from "../actions/constants";
import { connect } from "react-redux";

const HomePage = (props) => {
  return (
    <div>
      <h1>Welcome To UNO</h1>
      <Link to="/game">
        <button onClick={props.onStartGame}>START GAME</button>
      </Link>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onStartGame: () => dispatch({ type: START_GAME }),
  };
};

export default connect(null, mapDispatchToProps)(HomePage);
