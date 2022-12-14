import React, { Component } from "react";
import { connect } from "react-redux";
import Movie from "../Movies/Movie/Movie";
import TvSeries from "../Tv/TvSeries/TvSeries";
import listUrl from "../../references/listUrl";
import listAxiosParams from "../../references/listAxiosParams";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import uiClasses from "../../components/UI/Layout/Layout.module.css";
import classes from "./List.module.css";

class List extends Component {
  axiosCancel = axios.CancelToken.source();

  state = {
    listData: null,
    list: [],
    containerWidth: 0,
    currentElPosition: 0,
    listLoaded: false,
    scrollWidth: 0,
    moveRight: 0,
    headerMoveLeft: false,
    showNavRight: true,
    scrollPos: null,
    scrollMax: 0,
    showAll: false,
    noResults: false
  };

  constructor(props) {
    super(props);
    this.containerWidthRef = React.createRef();
    this.tryAgainTimer = null;
  }

  componentDidUpdate(prevState) {
    if (
      prevState.listLoaded !== this.state.listLoaded &&
      this.state.scrollWidth !== this.containerWidthRef.current.scrollWidth
    ) {
      this.setState({
        scrollWidth: this.containerWidthRef.current.scrollWidth
      });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.resizeHandler();
    }, 1000);
    this.setState({
      containerWidth: this.containerWidthRef.current.clientWidth
    });
    window.addEventListener("resize", this.resizeHandler);
    this.getListHandler();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
    this.axiosCancel.cancel("axios list request cancelled");
    if (this.tryAgainTimer) {
      clearTimeout(this.tryAgainTimer);
    }
  }

  getListHandler = async () => {
    const axiosParams = listAxiosParams(
      this.props.listType,
      this.props.query,
      this.props.actorId
    );
    const url = listUrl(this.props.listType, this.props.movieId);
    let page = {};
    for (let i = 1; i < 4; i++) {
      await axios
        .get(url, {
          cancelToken: this.axiosCancel.token,
          params: { ...axiosParams, page: i }
        })
        .then((response) => {
          page[i] = response.data.results;
        })
        .catch((error) => {
          console.log("error: " + error);
        });
    }
    if (page[1] && page[2] && page[3]) {
      this.setState({ listData: [...page[1], ...page[2], ...page[3]] });
    } else if (page[1] && page[2]) {
      this.setState({ listData: [...page[1], ...page[2]] });
    } else if (page[1]) {
      this.setState({ listData: [...page[1]] });
    }
    if (typeof page[1] !== "undefined") {
      if (page[1].length === 0) {
        this.setState({ noResults: true });
      }
    }
    this.resizeHandler();
  };

  getListTryAgainHandler = (timeOut) => {
    this.tryAgainTimer = setTimeout(() => {
      this.getListHandler();
    }, timeOut);
  };

  loadListHandler = (marg, navLeftClicked) => {
    const windowW = window.innerWidth;
    const movieDimensions =
      windowW <= 500
        ? {
            width: "90px",
            lazyW: 90,
            height: "135px",
            movieHeight: "initial",
            fontSize: "12px"
          }
        : {
            width: "195px",
            lazyW: 195,
            height: "293px",
            fontSize: "14px"
          };

    const releases = this.state.listData
      ? this.state.listData.map((result, index) => {
          if (this.props.mediaType === "movies") {
            return (
              <Movie
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  paddingTop: "0px"
                }}
                showAll={this.state.showAll}
                marg={marg + "px"}
                lazyWidth={marg * 2 + movieDimensions.lazyW}
                id={result.id}
                poster={result.poster_path}
                title={result.title}
                release={result.release_date}
                dimensions={movieDimensions}
              />
            );
          }
          if (this.props.mediaType === "tv" && result.poster_path) {
            return (
              <TvSeries
                marg={marg + "px"}
                lazyWidth={marg * 2 + movieDimensions.lazyW}
                id={result.id}
                backdrop={result.backdrop_path}
                title={result.name}
                poster={result.poster_path}
                release={result.release_date}
                dimensions={movieDimensions}
                streaming={this.props.streaming}
              />
            );
          }
        })
      : null;
    this.setState({
      list: releases,
      listLoaded: true
    });
    this.showNavRightHandler(navLeftClicked);
  };

  showNavRightHandler = (navLeftClicked) => {
    const scrollPosition = this.containerWidthRef.current.scrollLeft;
    const scrollMax =
      this.containerWidthRef.current.scrollWidth -
      this.containerWidthRef.current.clientWidth -
      this.containerWidthRef.current.clientWidth;
    this.setState({
      showNavRight:
        scrollPosition < scrollMax ? true : navLeftClicked ? true : false
    });
  };

  resizeHandler = async (elPos, navLeftClicked) => {
    if (this.state.showAll) {
      this.containerWidthRef.current.style.maxHeight =
        this.containerWidthRef.current.scrollHeight + "px";
    }

    const windowW = window.innerWidth;
    if (this.containerWidthRef.current) {
      const containerW = this.containerWidthRef.current.clientWidth;
      const scrollW = this.containerWidthRef.current.scrollWidth;
      const thumbW = windowW <= 500 ? 90 : 195;
      const elCount = Math.floor(containerW / thumbW);
      const marg = (containerW / elCount - thumbW) / 2;
      const move =
        typeof elPos === "number"
          ? elPos * (thumbW + marg * 2)
          : this.state.currentElPosition * (thumbW + marg * 2);

      this.setState({
        containerWidth: containerW,
        scrollWidth: scrollW
      });
      this.loadListHandler(marg, navLeftClicked);
      this.containerWidthRef.current.scrollTo({
        left: move,
        top: 0,
        behavior: "smooth"
      });
    }
  };

  navHandler = (direction) => {
    const windowW = window.innerWidth;
    const containerW = this.containerWidthRef.current.clientWidth;
    const scrollW = this.containerWidthRef.current.scrollWidth;
    const thumbW = windowW <= 500 ? 95 : 190;
    const actElCount = Math.floor(containerW / thumbW);
    const currentElPos = { ...this.state }.currentElPosition;

    switch (direction) {
      case "right":
        this.setState({
          moveRight: containerW + { ...this.state }.containerWidth,
          containerWidth: containerW + { ...this.state }.containerWidth,
          scrollWidth: scrollW,
          headerMoveLeft: true,
          currentElPosition: currentElPos + actElCount
        });
        this.resizeHandler(currentElPos + actElCount, false);
        break;
      case "left":
        this.setState({
          moveRight: containerW - { ...this.state }.containerWidth,
          containerWidth: containerW - { ...this.state }.containerWidth,
          scrollWidth: scrollW,
          headerMoveLeft: true,
          currentElPosition:
            currentElPos - actElCount >= 0 ? currentElPos - actElCount : 0,
          showNavRight: true
        });
        this.resizeHandler(currentElPos - actElCount, true);
        break;
      default:
        this.setState({
          moveRight: 0,
          containerWidth: 0,
          scrollWidth: 0,
          headerMoveLeft: false,
          currentElPosition: 0
        });
    }
  };

  showAllHandler = () => {
    this.setState({
      showAll: !this.state.showAll
    });
    const el = this.containerWidthRef.current;
    const initMax = el.querySelector("a").clientHeight + "px";
    el.style.maxHeight = initMax;
    if (!this.state.showAll) {
      el.scrollTo({
        left: el.scrollWidth - el.clientWidth
      });
      el.style.flexWrap = "wrap";
      el.style.maxHeight = "1500px";
      setTimeout(() => {
        el.style.maxHeight = "initial";
      }, 500);
    } else {
      el.style.maxHeight = "1500px";
      setTimeout(() => {
        el.style.maxHeight = initMax;
      }, 10);
      this.setState({ showNavRight: true });
    }
    this.navHandler();
  };

  render() {
    return (
      <div className={classes.List}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "5px",
            position: "relative"
          }}
        >
          <div className={classes.Bar} />
          {this.state.currentElPosition > 0 ? (
            <div
              className={uiClasses.NavLeft}
              onClick={() => this.navHandler("left")}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
          ) : null}

          {this.props.listType === "netflix" ? (
            <React.Fragment>
              <div className={classes.NetworkLogo + " " + classes.Netflix} />
              <h2 style={{ marginLeft: 0 }}>{this.props.heading}</h2>
            </React.Fragment>
          ) : this.props.listType === "amazon" ? (
            <React.Fragment>
              <div className={classes.NetworkLogo + " " + classes.Amazon} />
              <h2 style={{ marginLeft: 0 }}>{this.props.heading}</h2>
            </React.Fragment>
          ) : this.props.listType === "hulu" ? (
            <React.Fragment>
              <div className={classes.NetworkLogo + " " + classes.Hulu} />
              <h2 style={{ marginLeft: 0 }}>{this.props.heading}</h2>
            </React.Fragment>
          ) : this.props.listType === "disneyPlus" ? (
            <React.Fragment>
              <div className={classes.NetworkLogo + " " + classes.DisneyPlus} />
              <h2 style={{ marginLeft: 0 }}>{this.props.heading}</h2>
            </React.Fragment>
          ) : (
            <h2
              className={
                this.state.currentElPosition > 0
                  ? classes.SectionHeaderMoveLeft
                  : null
              }
            >
              {this.props.heading}
            </h2>
          )}
        </div>
        <div className={classes.ListContainer}>
          <div className={classes.ListItems} ref={this.containerWidthRef}>
            {this.state.list !== null
              ? this.state.list.length > 0
                ? this.state.list
                : null
              : null}
            {this.state.noResults ? (
              <h2 className={uiClasses.NoResults}>No Results Found</h2>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

export default connect(mapStateToProps)(List);
