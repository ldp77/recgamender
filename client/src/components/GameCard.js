import React, { Component } from "react";

export class GameCard extends Component {
  render() {
    return (
      <div style={style}>
        <h1>{this.props.title}</h1> <a href={this.props.steamlink}>steam</a>
        <div>{this.props.description}</div>
      </div>
    );
  }
}
const style = {
  borderRadius: "2em",
  boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
  padding: " 1em 1em",
  margin: "1em 0.5em",
  textAlign: "center",
};

export default GameCard;
