import * as actionTypes from "./actionTypes";

export const showSidebarHandler = (show) => {
  return {
    type: actionTypes.SHOW_SIDEBAR,
    show: show
  };
};
