import React, { Component } from "react";

export class PickedGame extends Component {
  constructor(props) {
    super();
    this.state = {
      hovered: false,
      selected: false,
    };
  }

  render() {
    return (
      <div
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
        onClick={() => {
          this.props.updateClicked(this.props.game.id);
          this.setState((prev) => {
            return { ...prev, selected: !prev.selected };
          });
        }}
        style={(() => {
          if (this.state.hovered) return style_hovered;
          if (this.state.selected) return style_selected;
          return style;
        })()}
      >
        {this.props.title}: {this.props.genre}
      </div>
    );
  }
}

export default PickedGame;

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
