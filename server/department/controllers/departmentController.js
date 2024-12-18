import Department from "../../../model/Department.js"
import asyncHandler from "../../../middleware/asyncHandler.js"

//add department 
export const newDepartment = asyncHandler(async(req, res) => {
  const {name} = req.body
  try {
    await Department.create({name: name})
    return res.status(200).json({message: "New Dept"})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//update department
export const updateDept = asyncHandler(async (req,res) => {
  const {id} = req.params
  const {name} = req.body
  const updateDept = await Department.findByIdAndUpdate(id, {name: name})
  if(!updateDept) return res.status(404).json({message: "Department not found"})
  return res.status(200).json({message: "Department successfully udate"})
})

//delete department
export const deleteDept = asyncHandler(async (req,res) => {
  const {id} = req.params
  const deleteDept = await Department.findByIdAndDelete(id)
  if(!deleteDept) return res.status(404).json({message: "Department not found"})
  return res.status(200).json({message: "Department successfully deleted"})
})

//all department
export const allDept = asyncHandler(async (req, res) => {
  try {
    const departments = await Department.find().sort({field: 'asc', name: 1})
    return res.status(200).json(departments)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})