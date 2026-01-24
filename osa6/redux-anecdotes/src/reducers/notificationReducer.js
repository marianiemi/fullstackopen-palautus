import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotificationText(state, action) {
      return action.payload;
    },
    clearNotification() {
      return "";
    },
  },
});

const { setNotificationText, clearNotification } = notificationSlice.actions;

let timeoutId;

// Thunk action creator
export const setNotification = (message, seconds) => {
  return (dispatch) => {
    dispatch(setNotificationText(message));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
