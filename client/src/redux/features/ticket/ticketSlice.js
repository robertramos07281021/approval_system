import {createSlice} from "@reduxjs/toolkit"


const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    // single ticket
    ticket: {},
    //with page
    tickets: [],
    //pager
    ticketPage: 1,
    //all tickets
    allTickets: [],
    //search
    search: "",
    reports: [],
    reportPage: 1,
    totalReportPage: 1,
    allTicketsReports: []
  },
  reducers: {
    setTicket: (state, action) => {
      state.ticket = action.payload;
    },
    setTickets: (state, action) => {
      state.tickets = action.payload
    },
    setTicketPage: (state, action) => {
      state.ticketPage = action.payload
    },
    setAllTickets: (state, action) => {
      state.allTickets = action.payload
    },
    removeTicket: (state) => {
      state.ticket = {}
    },
    setSearch: (state,action) => {
      state.search = action.payload
    },
    setReports: (state, action) => {
      state.reports = action.payload
    },
    setReportPage: (state,action) => {
      state.reportPage = action.payload
    },
    setTotalPeportPage: (state, action) => {
      state.totalReportPage = action.payload
    },
    setAllTicketsReports: (state, action)=> {
      state.allTicketsReports = action.payload
    },
    removeAllTicketsReports: (state) => {
      state.allTicketsReports = []
    }
  },
});

export const { 
  setTicket, 
  setTickets, 
  setTicketPage, 
  removeTicket, 
  setAllTickets, 
  setSearch,
  setReports, 
  setReportPage,
  setTotalPeportPage,
  setAllTicketsReports,
  removeAllTicketsReports
} = ticketSlice.actions;
export default ticketSlice.reducer;
