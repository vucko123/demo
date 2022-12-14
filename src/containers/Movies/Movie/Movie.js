import React, { Component } from "react";
import LazyLoad from "react-lazy-load";
import axios from "axios";

import mgLogo from "../../../assets/images/wF-icon.png";

import uiClasses from "../../../components/UI/Layout/Layout.module.css";
import classes from "./Movie.module.css";

class Movie extends Component {
  state = {
    posterHeight: null,
    rating: null,
    flip: false
  };

  constructor(props) {
    super(props);
    this.posterRef = React.createRef();
    this.frontRef = React.createRef();
    this.backRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("orientationchange", this.resizeHandler);
    this.resizeHandler();
    this.getRatingHandler();
    console.log(this.props.showAll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  getRatingHandler = () => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/" +
          this.props.id +
          "/release_dates",
        {
          params: {
            api_key: "4c7294000365c14a8e42109c863ff772"
          }
        }
      )
      .then((response) => {
        const rated = response.data.results.find(
          (rating) => rating.iso_3166_1 === "US"
        ).release_dates[0].certification;
        this.setState({ rating: rated });
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          const timeOut = parseInt(
            error.response.headers["retry-after"] + "000"
          );
          setTimeout(() => {
            this.getRatingHandler();
          }, timeOut);
        } else {
          console.log("error: " + error);
        }
      });
  };

  resizeHandler = () => {
    if (this.posterRef.current) {
      this.setState({
        posterHeight:
          this.posterRef.current.clientWidth / 2 +
          this.posterRef.current.clientWidth
      });
    }
  };

  scoresClick = (event) => {
    event.preventDefault();
    this.setState({ flip: !this.state.flip });
    console.dir(this.backRef.current);
  };

  render() {
    return (
      <LazyLoad threshold={1400} width={this.props.lazyWidth}>
        <div
          className={classes.Movie}
          // onClick={this.props.clicked}
          style={{
            width: this.props.dimensions ? this.props.dimensions.width : "",
            height: this.props.dimensions
              ? this.props.dimensions.movieHeight
              : "",
            marginLeft: this.props.marg,
            marginRight: this.props.marg,
            marginBottom: this.props.margB ? this.props.margB : null
          }}
        >
          <div
            className={classes.Poster + " " + uiClasses.BoxShadow}
            ref={this.posterRef}
            style={{
              minHeight: this.props.dimensions
                ? this.props.dimensions.posterHeight
                  ? this.props.dimensions.posterHeight
                  : null
                : "",
              width: this.props.dimensions ? this.props.dimensions.width : "",
              height: this.props.dimensions ? this.props.dimensions.height : ""
            }}
          >
            <div
              // className={classes.Back}
              className={
                this.state.flip
                  ? classes.Back + " " + classes.BackFlip
                  : classes.Back
              }
              style={{
                backgroundImage:
                  "url('http://image.tmdb.org/t/p/w342/" +
                  this.props.poster +
                  "')"
              }}
              ref={this.backRef}
            >
              <div className={classes.BackOverlay} />
              <div className={classes.BackInfo}></div>
            </div>

            <img
              src={
                this.props.poster
                  ? "http://image.tmdb.org/t/p/w342/" + this.props.poster
                  : mgLogo
              }
              style={!this.props.poster ? { width: "40%" } : null}
              className={
                this.state.flip
                  ? classes.Front + " " + classes.FrontFlip
                  : classes.Front
              }
              alt=""
              ref={this.frontRef}
            />
            <div
              className={classes.EllipsisIcon}
              onClick={(event) => this.scoresClick(event)}
              style={{ color: "#ccc" }}
            ></div>
          </div>
        </div>
      </LazyLoad>
    );
  }
}

export default Movie;
