import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ReactGA from "react-ga";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import List from "../List/List";

import uiClasses from "../../components/UI/Layout/Layout.module.css";
import classes from "./Streaming.module.css";

ReactGA.initialize("UA-147154395-1");
ReactGA.pageview(window.location.pathname + window.location.search);

class Movies extends Component {
  state = {
    searchQuery: null,
    searchResults: false,
    showSearch: false
  };

  inputHandler = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  searchHandler = (event) => {
    event.preventDefault();
    this.setState({ searchResults: true });
  };

  showSearchHandler = () => {
    this.setState({ showSearch: !this.state.showSearch });
  };

  render() {
    if (this.state.searchResults) {
      this.setState({ searchResults: false });
      return (
        <Redirect to={"/Movies/SearchResults/" + this.state.searchQuery} />
      );
    }
    return (
      <Aux>
        <div className={classes.Movies}>
          <div className={uiClasses.SectionHeader + " " + uiClasses.PageHeader}>
            <div className={uiClasses.PageTitle}>
              {/* <FontAwesomeIcon className={classes.MoviesIcon} icon={faMixcloud} /> */}

              <h2 style={{ left: "46px" }} className={classes.SectionHeaderH2}>
                Streaming TV
              </h2>
            </div>
          </div>
          <div
            className={
              this.state.showSearch
                ? classes.SearchSectionShow + " " + classes.SearchSection
                : classes.SearchSection
            }
          ></div>
          <List
            listType="popularStreamingTv"
            mediaType="tv"
            heading="Popular"
            streaming={true}
          />
          <List
            listType="topRatedStreamingTv"
            mediaType="tv"
            heading="Top Rated"
            streaming={true}
          />
          <List
            listType="netflix"
            mediaType="tv"
            heading="Netflix"
            streaming={true}
          />
          <List
            listType="amazon"
            mediaType="tv"
            heading="Amazon Prime"
            streaming={true}
          />
          <List
            listType="hulu"
            mediaType="tv"
            heading="Hulu"
            streaming={true}
          />
          <List
            listType="disneyPlus"
            mediaType="tv"
            heading="Disney +"
            streaming={true}
          />
        </div>
      </Aux>
    );
  }
}

export default Movies;
