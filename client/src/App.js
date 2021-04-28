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
    };
  }
  async componentDidMount() {
    console.log("here");
    await fetch("/games", {
      mode: "no-cors",
    })
      .then((resp) => resp.json())
      .then((data) => this.setState({ games: data }));
  }

  updateGames = async (id) => {
    console.log(id);
    const els = this.state.games.filter(
      (el) => el.id == id && el.related.length > 0
    );
    if (els.length == 0) {
      console.log("error: length == 0");
      return;
    }
    console.log("howdy");
    console.log(els);
    const el = els[0];
    for (let relatedid of el.related) {
      await fetch("/title/" + relatedid)
        .then((resp) => {
          console.log(resp);
          return resp;
        })
        .then((resp) => resp.json())
        .then((json) => {
          console.log(("json: ", json));

          for (let game of this.state.games) {
            console.log(game.id, json.id);
            if (game.id == json.id) {
              console.log("really?");
              return;
            }
          }
          console.log("howdyyyy");
          this.setState((prev) => {
            console.log("called");
            return {
              games: [
                ...prev.games,
                { id: json.id, name: json.name, related: [] },
              ],
            };
          });
          console.log("set_state,", json);
        });
    }
  };

  nextClicked = (clicked) => {
    console.log(clicked);
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
          games={[
            {
              title: "hoi4",
              description: "HOI4 is a strategy game",
              genre: "grand strategy",
              steamlink:
                "https://store.steampowered.com/app/394360/Hearts_of_Iron_IV/",
            },
          ]}
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
