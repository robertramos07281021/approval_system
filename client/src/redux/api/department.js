import {apiSlice} from "./apiSlice"

export const departmentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //add department
    addDepartment: builder.mutation({
      query: ({name}) => ({
        url: "/api/department/new-department",
        method: "POST",
        body: {name}
      })
    }),
    //update dept
    updateDepartment: builder.mutation({
      query: ({id, name}) => ({
        url: `/api/department/update-department/${id}`,
        method: "PUT",
        body: {name}
      })
    }),
    //delete dept
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url:`/api/department/delete-department/${id}`,
        method: "DELETE",
      })
    }),
    // all dept query
    allDepartment: builder.query({
      query: () => `/api/department/all-departments`
    })
  })
})

export const {
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useAllDepartmentQuery
} = departmentSlice