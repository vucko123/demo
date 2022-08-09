import React, { Component } from "react";
import { Route } from "react-router-dom";
import ReactGA from "react-ga";
import Movies from "./containers/Movies/Movies";
import Streaming from "./containers/Streaming/Streaming";
import SideBar from "./containers/UI/SideBar/SideBar";
import Tv from "./containers/Tv/Tv";
import Aux from "./hoc/Auxiliary/Auxiliary";
import NavBar from "./containers/UI/NavBar/NavBar";
import Home from "./components/Home/Home";

ReactGA.initialize("UA-147154395-1");
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <Aux>
        <NavBar />
        <SideBar />
        <Route path="/" exact render={(props) => <Home />} />
        <Route path="/Movies" exact render={(props) => <Movies />} />
        <Route path="/Streaming" exact render={(props) => <Streaming />} />
        <Route path="/Tv" exact render={(props) => <Tv />} />
      </Aux>
    );
  }
}

export default App;
