import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react"
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice"
import ticketReducer from "./features/ticket/ticketSlice"
import deptReducer from "./features/dept/deptSlice"

const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      ticket: ticketReducer,
      dept: deptReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
      devTools: true,
})


setupListeners(store.dispatch);
export default store;