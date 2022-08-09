import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./NavBar.module.css";

class NavBar extends Component {
  state = {
    menuOpen: false
  };

  menuClickHandler = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ showSearch: false });
    }
  }

  render() {
    return (
      <Aux>
        <div className={classes.NavBar}>
          <div className={classes.NavBarInner}>
            <div className={classes.Logo}>
              <h2>
                <span style={{ fontWeight: "200" }}>we</span>
                <span style={{ fontWeight: "200" }}>Four</span>
                <span style={{ fontWeight: "600" }}>Media</span>
              </h2>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default withRouter(NavBar);
