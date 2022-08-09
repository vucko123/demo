import * as actionTypes from "../store/actions/actionTypes";

const initialState = {
  token: null,
  userId: null,
  displayName: null,
  profilePic: null,
  emailId: null,
  userData: null,
  error: null,
  loading: false,
  createAccount: false,
  playVideo: false,
  playVideoUrl: null,
  videoResults: null,
  videoCount: null,
  videoSliceStart: 0,
  videoSliceEnd: null,
  videoPageSize: null,
  videoCurrentPage: 1,
  videoShowAll: false,
  showSidebar: false,
  showSearchSidebar: false,
  showExtendedMenu: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_DISPLAYNAME:
      return {
        ...state,
        displayName: action.displayName
      };
    case actionTypes.STORE_PROFILEPIC:
      return {
        ...state,
        profilePic: action.profilePicUrl
      };
    case actionTypes.STORE_EMAIL:
      return {
        ...state,
        emailId: action.email
      };
    case actionTypes.STORE_TOKEN:
      return {
        ...state,
        token: action.tokenId
      };
    case actionTypes.STORE_USERID:
      return {
        ...state,
        userId: action.userId
      };
    case actionTypes.STORE_USERDATA:
      return {
        ...state,
        userData: action.userData
      };
    case actionTypes.CLEAR_AUTH_FAIL:
      return {
        ...state,
        error: null
      };
    case actionTypes.SHOW_SEARCH_SIDEBAR:
      return {
        ...state,
        showSearchSidebar: action.show
      };

    case actionTypes.SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: action.show
      };
    case actionTypes.SHOW_EXTENDEDMENU:
      return {
        ...state,
        showExtendedMenu: action.show
      };
    default:
      return state;
  }
};

export default reducer;
