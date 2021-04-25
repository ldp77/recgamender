import React, { Component } from "react";
import Game from "./Game";
export class IntroPage extends Component {
  constructor(props) {
    super();
    this.state = {
      clicked: new Set(),
      next_hovered: false,
    };
  }

  updateClicked = (game) => {
    if (this.state.clicked.has(game)) {
      this.setState((prev) => {
        prev.clicked.delete(game);
        return prev;
      });
    } else {
      this.setState((prev) => {
        prev.clicked.add(game);
        return prev;
      });
      this.props.updateClicked(game);
    }
  };
  render() {
    let games = [];
    for (let title of this.props.games.keys()) {
      games.push(
        <Game
          updateClicked={(title) => {
            this.updateClicked(title);
          }}
          game={{ title: title }}
          key={title}
        ></Game>
      );
    }
    let next = (
      <span
        style={(() => {
          if (this.state.clicked.size >= 6)
            return this.state.next_hovered
              ? button_style_hovered
              : button_style;
          else return button_style_disabled;
        })()}
        onMouseEnter={() => {
          this.setState({ next_hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ next_hovered: false });
        }}
        onClick={() => {
          if (this.state.clicked.size >= 6)
            this.props.nextClicked(this.state.clicked);
        }}
      >
        next
      </span>
    );

    return (
      <div style={body_style}>
        <div style={title_style}>
          {" "}
          Howdy, select games you like: <br />
        </div>
        <div style={cont_style}>{games}</div>
        {next}
      </div>
    );
  }
}

export default IntroPage;

const body_style = {
  margin: "20%",
  textAlign: "center",
  padding: "10%",
  borderRadius: "1em",
  boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
};

const title_style = {
  marginBottom: "1em",
  fontSize: "2em",
};
const cont_style = {
  display: "flex",
  alignContent: "center",
  flexWrap: "wrap",
};

const button_style = {
  borderRadius: "2em",
  boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
  padding: " 0.5em 1em",
  margin: "1em 0.5em",
  float: "right",
};

const button_style_hovered = {
  ...button_style,
  backgroundColor: "#ddd",
  cursor: "pointer",
};

const button_style_selected = {
  ...button_style,
  backgroundColor: "#ccc",
};

const button_style_disabled = {
  ...button_style,
  opacity: "50%",
};
