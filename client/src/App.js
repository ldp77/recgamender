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
    this.state.games.forEach((el) => {
      if (el.id == id) {
        if (el.related.length > 0) {
          el.related.forEach(
            async (el) =>
              await fetch("/titles/" + el.id)
                .then((resp) => {
                  console.log(resp);
                  return resp;
                })
                .then((resp) => resp.json())
                .then((json) => {
                  console.log("hosy");
                  console.log(json);
                })
          );
        }
      }
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
