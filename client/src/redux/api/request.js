import {apiSlice} from "./apiSlice"

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //creating new request
    newRequest: builder.mutation({
      query: (data) => ({
        url: "/api/ticket/new_request",
        method: "POST",
        body: data,
      }),
    }),
    //user-tickets with page
    userTicketsPage: builder.query({
      query: (page) => `/api/ticket/user-tickets/${page}`
    }),
    //user-tickets
    userTickets: builder.query({
      query: () => `/api/ticket/user-tickets/`
    }),
    //open new tickets
    ticketOpen: builder.mutation({
      query: (id) => ({
        url: `/api/ticket/ticket-open/${id}`,
        method: "PUT"
      })
    }),
    //aom-tickets
    aomTickets: builder.query({
      query: () => `/api/ticket/aom-tickets`
    }),
    //aom-tickets with page
    aomTicketsPage: builder.query({
      query: (page) => `/api/ticket/aom-tickets/${page}`
    }),
    //ticket-declined
    ticketDeclined: builder.mutation({
      query: ({id, comment, name}) => ({
        url: `/api/ticket/ticket-declined/${id}`,
        method: "PUT",
        body: {comment, name}
      })
    }),
    //aom-ticket-approval
    aomTicketApproval: builder.mutation({
      query: ({id, comment}) => ({
        url: `/api/ticket/aom-ticket-approval/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //user-ticket-reattempt
    userTicketReattempt: builder.mutation({
      query: ({id, data}) => ({
        url: `/api/ticket/user-ticket-reattempt/${id}`,
        method: "PUT",
        body: data
      })
    }),
    //user-ticket-update
    userTicketUpdate: builder.mutation({
      query: ({id, data}) => ({
        url: `/api/ticket/user-ticket-update/${id}`,
        method: "PUT",
        body: data
      })
    }),
    //user-ticket-delete
    userTicketDelete: builder.mutation({
      query: (id) => ({
        url: `/api/ticket/user-ticket-delete/${id}`,
        method: "DELETE"
      })
    }),
    //all-tickets
    allTickets: builder.query({
      query: () => '/api/ticket/all-tickets'
    }),
    //all-tickets-with-page
    allTicketsWithPage: builder.query({
      query: (id) => `/api/ticket/all-tickets/${id}`
    }),
    //ticket-oos-update
    ticketOosUpdate: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-oos/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //ticket-verify-update
    ticketVerifyUpdate: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-verified/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //ticket-oos-comment-update
    ticketOosCommentUpdate: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-oos-comment/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //ticket fraud
    updateFraud: builder.mutation({
      query: ({id,comment,name}) => ({
        url: `/api/ticket/ticket-fraud/${id}`,
        method: "PUT",
        body:{comment,name}
      })
    }),
    //deleting fraud
    deleteFraud: builder.mutation({
      query: (id) => ({
        url: `/api/ticket/ticket-fraud-delete/${id}`,
        method: "DELETE"
      })
    }),
    //for last approval
    updateLastApproval: builder.mutation({
      query: ({id, comment}) => ({
        url: `/api/ticket/ticket-last-approval/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //for complete
    updateIsComplete: builder.mutation({
      query:({id,comment,name}) => ({
        url: `/api/ticket/ticket-completed/${id}`,
        method: "PUT",
        body: {comment, name}
      })
    }),
    //for semi-approval
    updateSemiApproval: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-semi-approval/${id}`,
        method: "PUT",
        body: {comment}
      }) 
    }),
    // search
    search: builder.query({
      query: ({page, query}) => `/api/ticket/ticket-search/${page}?status=${query}`
    }),
    //max pages search
    maxPagesSearch: builder.query({
      query: (query) => `/api/ticket/ticket-maxpage-search?status=${query}`
    }),
    //report
    report: builder.query({
      query: ({branch, dept, from, to,page}) => `/api/ticket/ticket-report/${page}?branch=${branch ? branch : ""}&dept=${dept ? dept : ""}&from=${from ? from : ""}&to=${to ? to : ""}`
    }),
    //ticket purchasing new item
    purchasingNewItem: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-purchasing-new-item/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //ticket purchasing used item
    purchasingUsedItem: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-purchasing-used-item/${id}`,
        method: "PUT",
        body: {comment}
      })
    }),
    //ticket purchasing oos
    purchasingOos: builder.mutation({
      query: ({id, comment})=> ({
        url: `/api/ticket/ticket-purchasing-oos/${id}`,
        method: "PUT",
        body: {comment}
      })
    })
  })
})

export const {
  useNewRequestMutation,
  useUserTicketsQuery,
  useTicketOpenMutation ,
  useUserTicketsPageQuery,
  useAomTicketsQuery,
  useAomTicketsPageQuery,
  useTicketDeclinedMutation,
  useAomTicketApprovalMutation,
  useUserTicketReattemptMutation,
  useUserTicketUpdateMutation,
  useUserTicketDeleteMutation,
  useAllTicketsQuery,
  useAllTicketsWithPageQuery,
  useTicketVerifyUpdateMutation,
  useTicketOosUpdateMutation,
  useTicketOosCommentUpdateMutation,
  useUpdateFraudMutation,
  useDeleteFraudMutation,
  useUpdateLastApprovalMutation,
  useUpdateIsCompleteMutation,
  useUpdateSemiApprovalMutation,
  useSearchQuery,
  useMaxPagesSearchQuery,
  useReportQuery,
  usePurchasingNewItemMutation,
  usePurchasingOosMutation,
  usePurchasingUsedItemMutation
} = requestApiSlice;