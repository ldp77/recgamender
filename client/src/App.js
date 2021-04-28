// import logo from './logo.svg';
// import './App.css';
import React, { Component } from "react";
import IntroPage from "./components/IntroPage";
import Recommended from "./components/Recommended";
export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      games: [],
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
    console.log(id);
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
        .then((resp) => {
          console.log(resp);
          return resp;
        })
        .then((resp) => resp.json())
        .then((json) => {
          for (let game of this.state.games) {
            console.log(game.id, json.id);
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
    console.log(clicked.join("_"));
    await fetch("/rankings/" + clicked.join("_"))
      .then((resp) => resp.json())
      .then((json) => {
        return Promise.all(
          json.map(async (id) => {
            return fetch("/info/" + id)
              .then((resp) => resp.json())
              .then((json) => {
                this.setState({
                  recomendations: [...this.state.recomendations, json],
                });
                return json;
              });
          })
        );
      });
    window.location.href = "/#reccomended";
  };
  render() {
    return (
      <div>
        {" "}
        <IntroPage
          updateClicked={this.updateGames}
          nextClicked={this.nextClicked}
          games={this.state.games}
        ></IntroPage>
        <Recommended
          id="recommended"
          games={this.state.recomendations}
        ></Recommended>
      </div>
    );
  }
}

export default App;

// c
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
