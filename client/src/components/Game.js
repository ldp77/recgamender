import React, { Component } from "react";

export class Game extends Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      selected: false,
    };
  }

  render() {
    return (
      <span
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
        onClick={() => {
          this.setState((prev) => {
            this.props.updateClicked(this.props.game.id);

            return { ...prev, selected: !prev.selected };
          });
        }}
        style={(() => {
          if (this.state.hovered) return style_hovered;
          if (this.state.selected) return style_selected;
          return style;
        })()}
      >
        {this.props.game.title}
      </span>
    );
  }
}

export default Game;

const style = {
  borderRadius: "2em",
  boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
  padding: " 0.5em 1em",
  margin: "1em 0.5em",
};

const style_hovered = {
  ...style,
  backgroundColor: "#ddd",
  cursor: "pointer",
};

const style_selected = {
  ...style,
  backgroundColor: "#ccc",
};
