import asyncHandler from "../../../middleware/asyncHandler.js";
import Branch from "../../../model/Branch.js";

export const newBranch = asyncHandler(async(req, res) => {
  const {name} = req.body
  try {
    const newBranch = await Branch.create({name: name})
    return res.status(200).json(newBranch)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

export const deleteBranch = asyncHandler(async(req, res)=> {
  const {id} = req.params
  const branch = await Branch.findByIdAndDelete(id)
  if(!branch) return res.status(404).json({message: "Branch not found"})

  return res.status(200).json({message: "Branch successfully deleted"})
})

export const allBranches = asyncHandler(async(req, res) => {
  try {
    const branches = await Branch.find()
    return res.status(200).json(branches)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})



