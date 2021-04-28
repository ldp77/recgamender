// import logo from './logo.svg';
// import './App.css';
import React, { Component } from "react";
import IntroPage from "./components/IntroPage";
import Recommended from "./components/Recommended";
export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      games: new Set(),
    };
  }
  async componentDidMount() {
    await fetch("http://localhost:5000/games")
      .then((resp) => {
        console.log(resp);
        return resp.json();
      })
      .then((json) => {
        console.log("howdy");
        console.log(json);
        this.setState({ games: new Set(json) });
      });
  }
  updateGames = (title) => {
    if (!this.state.games.has(title)) {
      let cpy = new Map(this.state.games);
      cpy.set(title, []);
      this.setState(() => {
        return {
          games: cpy,
        };
      });
    }
    if (this.state.games.get(title).length == 0) {
      setTimeout(() => {
        let cpy = new Map(this.state.games);
        cpy.set(title, ["a", "b", "c"]);
        this.setState((prev) => {
          prev.games.set(title, ["a", "b", "c"]);
          return prev;
        });

        let adj = this.state.games.get(title);
        let to_add = adj.filter((el) => !this.state.games.has(el));
        this.setState((prev) => {
          to_add.forEach((el) => {
            prev.games.set(el, []);
          });
          return prev;
        });
      }, 800);
      return;
    }

    let adj = this.state.games.get(title);
    let to_add = adj.filter((el) => !this.state.games.has(el));
    this.setState((prev) => {
      to_add.forEach((el) => {
        prev.games.set(el, []);
      });
      return prev;
    });
  };

  nextClicked = (clicked) => {
    console.log(clicked);
  };
  render() {
    return (
      <div>
        {" "}
        <IntroPage
          updateClicked={(title) => {
            this.updateGames(title);
          }}
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
