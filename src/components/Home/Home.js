import React from "react";
import List from "../../containers/List/List";

import Slider from "../../containers/Slider/Slider";
import Aux from "../../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faTv } from "@fortawesome/free-solid-svg-icons";
import uiClasses from "../../components/UI/Layout/Layout.module.css";
import classes from "./Home.module.css";

const Home = (props) => {
  return (
    <Aux>
      <div className={classes.Home}>
        <div className={classes.SliderContainer}>
          <Slider />
        </div>
        <Aux>
          {props.isAuth && localStorage.getItem("userData") ? (
            // {props.isAuth && props.userData ? (
            <Aux>
              <List
                listType="pickedMovies"
                mediaType="movies"
                heading="Your Movie Picks"
              />
              <List
                listType="pickedTv"
                mediaType="tv"
                heading="Your Television Picks"
              />
            </Aux>
          ) : null}
          <div
            className={
              !props.isAuth
                ? uiClasses.SectionHeader +
                  " " +
                  uiClasses.PageHeader +
                  " " +
                  classes.PageHeaderFirst
                : uiClasses.SectionHeader + " " + uiClasses.PageHeader
            }
          >
            <div className={uiClasses.PageTitle}>
              <FontAwesomeIcon icon={faFilm} className={classes.MoviesIcon} />
              <h2>Films</h2>
            </div>
          </div>
          <List listType="inTheatres" mediaType="movies" heading="Genres" />
          <List
            listType="upcomingReleases"
            mediaType="movies"
            heading="Watchlist"
          />
          <div
            className={
              uiClasses.SectionHeader +
              " " +
              uiClasses.PageHeader +
              " " +
              classes.Sect
            }
          >
            <div className={uiClasses.PageTitle}>
              <FontAwesomeIcon icon={faTv} className={classes.TvIcon} />
              <h2>Webseries</h2>
            </div>
          </div>
          <List listType="airingThisWeek" mediaType="tv" heading="Addictive" />
          <List listType="airingToday" mediaType="tv" heading="Kids" />
        </Aux>
      </div>
    </Aux>
  );
};
export default Home;
