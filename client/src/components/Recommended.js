import React, { Component } from "react";
import GameCard from "./GameCard";
export class Recommended extends Component {
  render() {
    return (
      <div style={body_style}>
        {this.props.games.map((game) => (
          <GameCard
            title={game.title}
            steamlink={game.steamlink}
            genre={game.genre}
            description={game.description}
          ></GameCard>
        ))}
      </div>
    );
  }
}

export default Recommended;

const body_style = {
  margin: "20%",
  textAlign: "center",
  padding: "10%",
  borderRadius: "1em",
  boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
};
