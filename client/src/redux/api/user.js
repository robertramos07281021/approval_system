import {apiSlice} from "./apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //create account
    createAccount: builder.mutation({
      query: (data) => ({
        url: "/api/users/create",
        method: "POST",
        body: data,
      }),
    }),
    //login
    login: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),
    //logout
    logout: builder.mutation({
      query: (id) => ({
        url: `/api/users/logout/${id}`,
        method: "POST",
      }),
    }),
    //update user
    updateUser: builder.mutation({
      query: ({id, data}) => ({
        url: `/api/users/update-account/${id}`,
        method: "PUT",
        body: data
      })
    }),
    //change pass
    changePassword: builder.mutation({
      query: ({id, data}) => ({
        url: `/api/users/change-password/${id}`,
        method: "PUT",
        body: data
      }) 
    }),
    //all user
    allUsers: builder.query({
      query: ()=> `/api/users/find-alluser`
    }),
    //update login status
    updateLogin: builder.mutation({
      query: (id) => ({
        url: `/api/users/update-isonline/${id}`,
        method: "PUT"
      })
    }),
    findUser: builder.query({
      query: (id)=> `/api/users/find-user/${id}`
    }),
    updateItIsOnline: builder.mutation({
      query: (username) => ({
        url: `/api/users/update-it-is-online?username=${username}`,
        method: "PUT"
      })
    }),

  })
})

export const {
  useCreateAccountMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useAllUsersQuery,
  useUpdateLoginMutation,
  useFindUserQuery,
  useUpdateItIsOnlineMutation
} = userApiSlice;