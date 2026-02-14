import { createSlice } from "@reduxjs/toolkit";
import { set } from "zod";

const getFromLocalStorage = (key: string, defaultValue: string | boolean) => {
  if (typeof window === "undefined") return defaultValue; // SSR-safe
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;
  try {
    return JSON.parse(stored) as boolean;
  } catch {
    return !!stored; // if not JSON
  }
};

// Initial values
const initialState = {
  selectedConversation: getFromLocalStorage("selectedConversation", ""),
  openRightSidebar: getFromLocalStorage("inbox_right_sidebar_open", false),
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: initialState,
  reducers: {
    setSelectedConversation(state, action) {
      state.selectedConversation = action.payload;
      localStorage.setItem("selectedConversation", action.payload);
    },
    setOpenRightSidebar(state, action: { payload: boolean }) {
      state.openRightSidebar = action.payload;
      localStorage.setItem(
        "inbox_right_sidebar_open",
        action.payload.toString()
      );
    },
    toggleOpenRightSidebar(state) {
      state.openRightSidebar = !state.openRightSidebar;
      localStorage.setItem(
        "inbox_right_sidebar_open",
        JSON.stringify(state.openRightSidebar)
      );
    },
  },
});

export const {
  setSelectedConversation,
  setOpenRightSidebar,
  toggleOpenRightSidebar,
} = conversationSlice.actions;
export default conversationSlice.reducer;
