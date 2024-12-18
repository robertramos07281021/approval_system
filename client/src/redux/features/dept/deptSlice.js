import {createSlice} from "@reduxjs/toolkit"


const deptSlice = createSlice({
  name: "dept",
  initialState: {
    // single dept
    dept: {},
    //all depts
    depts: [],
    branches: [],
    branch: {}
  },
  reducers: {
    setDept: (state, action) => {
      state.dept = action.payload;
    },
    setDepts: (state, action) => {
      state.depts = action.payload
    },
    removeDept: (state) => {
      state.dept = {}
    },
    setBranches: (state, action)=> {
      state.branches = action.payload
    }, 
    setBranch: (state, action) => {
      state.branch = action.payload
    },
    removeBranch: (state) => {
      state.branch = {}
    }
  },
});

export const { setDept, setDepts, removeDept, setBranches, setBranch,removeBranch} = deptSlice.actions;
export default deptSlice.reducer;
