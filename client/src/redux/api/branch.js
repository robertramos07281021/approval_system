import {apiSlice} from "./apiSlice"

export const branchSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // new branch
    newBranch: builder.mutation({
      query: ({name})=> ({
        url: '/api/branch/create',
        method: "POST",
        body: {name}
      }),  
    }),
    //delete branch
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/api/branch/delete/${id}`,
        method: "DELETE"
      })
    }),
    allBranches: builder.query({
      query: ()=> `/api/branch/branches`
    })
  })
})

export const {
  useNewBranchMutation,
  useDeleteBranchMutation,
  useAllBranchesQuery,
} = branchSlice