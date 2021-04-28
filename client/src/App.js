// import logo from './logo.svg';
// import './App.css';
import React, { Component } from "react";
import IntroPage from "./components/IntroPage";
import Recommended from "./components/Recommended";
import PickedGame from "./components/PickedGame";
export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      games: [],
      clicked: [],
      recomendations: [],
    };
  }
  async componentDidMount() {
    await fetch("/games", {
      mode: "no-cors",
    })
      .then((resp) => resp.json())
      .then((data) => this.setState({ games: data }));
  }

  updateGames = async (id) => {
    const els = this.state.games.filter((el) => el.id == id);
    if (els.length == 0) {
      console.log("error: length == 0");
      return;
    }
    const el = els[0];
    if (el.related.length == 0) {
      await fetch("/related/" + el.id)
        .then((resp) => resp.json())
        .then((json) => {
          el.related = json;
        });
    }
    for (let relatedid of el.related) {
      await fetch("/title/" + relatedid)
        .then((resp) => resp.json())
        .then((json) => {
          for (let game of this.state.games) {
            if (game.id == json.id) {
              console.log("really?");
              return;
            }
          }
          this.setState((prev) => {
            return {
              games: [
                ...prev.games,
                { id: json.id, name: json.name, related: [] },
              ],
            };
          });
        });
    }
  };

  nextClicked = async (clicked) => {
    await Promise.all(
      clicked.map((id) => {
        return fetch("info/" + id)
          .then((resp) => resp.json())
          .then((json) => {
            this.setState({ clicked: [...this.state.clicked, json] });
          });
      })
    );

    console.log(clicked.join("_"));
    await fetch("/rankings/" + clicked.join("_"))
      .then((resp) => resp.json())
      .then((json) => {
        return Promise.all(
          json.map(async (id) => {
            return fetch("/info/" + id)
              .then((resp) => resp.json())
              .then((json) => {
                if (this.state.games.filter((game) => json.id == game.id) == 0)
                  this.setState({
                    recomendations: [...this.state.recomendations, json],
                  });
                return json;
              });
          })
        );
      });
  };
  render() {
    return (
      <div>
        <div
          style={{
            ...title_style,
            textAlign: "center",
            marginTop: "2em",
            marginBottom: "0",
          }}
        >
          Recgamenders
        </div>
        <IntroPage
          updateClicked={this.updateGames}
          nextClicked={this.nextClicked}
          games={this.state.games}
        ></IntroPage>
        {this.state.clicked.length ? (
          <React.Fragment>
            <div style={body_style}>
              <span style={title_style}>You Selected</span>
              <div style={cont_style}>
                {this.state.clicked.map((el) => (
                  <PickedGame
                    title={el.name}
                    genre={el.genre}
                    id={el.id}
                  ></PickedGame>
                ))}
              </div>
            </div>
            <Recommended
              id="recommended"
              games={this.state.recomendations}
            ></Recommended>
          </React.Fragment>
        ) : (
          <span></span>
        )}
      </div>
    );
  }
}

export default App;

const cont_style = {
  display: "flex",
  alignContent: "space-between",
  flexWrap: "wrap",
};

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
