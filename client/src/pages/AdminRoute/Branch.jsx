/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { DashboardWrapper } from '../../components/DashboardWrapper'
import { useAllBranchesQuery, useDeleteBranchMutation, useNewBranchMutation } from '../../redux/api/branch'
import { useNavigate } from 'react-router-dom'
import { Confirmation } from '../../components/Confirmation'
import { Notification } from '../../components/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { removeBranch, setBranch, setBranches } from '../../redux/features/dept/deptSlice'

export const Branch = () => {
  const {data: allBranches, refetch,} = useAllBranchesQuery()
  const [newBranch] = useNewBranchMutation()
  const [name, setName] = useState('')
  const [addBranch, setAddBranch] = useState(false)
  const [required, setRequired] = useState(false)
  const [success,setSuccess] = useState(false)
  const navigate = useNavigate()
  const {branches,branch} = useSelector((state) => state.dept)
  const dispatch = useDispatch()
  const [delBranch] = useDeleteBranchMutation()
  const [successDeleteBranch, setSuccessDeleteBranch] = useState(false)

  const handleAdd = ()=> {
    if(name.trim() !== ""){
      setAddBranch(true)
      setRequired(false)
    } else {
      setRequired(true)
    }
  }

  const handleSubmitAdd = async() => {
    const res = await newBranch({name: name})
    if(!res.error) {
      setSuccess(true)
      setName("")
      refetch()
      setAddBranch(false)
    } else {
      if(res.error?.data?.message === "Danger") {
        navigate('/danger?error=Danger')
      }
    }
  }
  const [deleteBranch, setDeleteBranch] = useState(false)

  const handleBranch = (branch)=> {
    setDeleteBranch(true)
    dispatch(setBranch(branch))
  }

  const handleSubmitDeleteBranch = async()=> {
    const res = await delBranch(branch._id)

    if(!res.error) {
      setDeleteBranch(false)
      dispatch(removeBranch())
      setSuccessDeleteBranch(true)
      refetch()
    }
  }

  useEffect(()=> {
    dispatch(setBranches(allBranches))
  },[allBranches,refetch])

  return (
    <>
      <DashboardWrapper>
        <div className='text-3xl font-bold'>
          Branch
        </div>
        <div className='h-full w-full grid grid-cols-2 gap-2'>
          <div className=' flex items-center justify-center'>
            <div className='w-80 flex flex-col gap-5'>
              <div className='text-center text-xl font-bold'>Add New Branch</div>
              {required &&
                <p className='text-xs text-red-500 font-semibold text-center'>Please add branch</p>
              }
              <label >
                <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className='w-full border-2 p-2 rounded' pattern='[A-Za-z]{1,16}'required />
              </label> 
              <div className='text-center'>
              <button className='border-2 border-blue-500 py-2 px-5 bg-blue-500 text-white font-bold rounded shadow-md shadow-black/50 hover:text-blue-500 hover:bg-white duration-200 ease-in-out' onClick={handleAdd}>Submit</button>
              </div>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='text-lg font-bold text-center'>Branches</div>
            <div className='h-[600px] overflow-y-auto'>
              {
                branches?.map((branch) => <div key={branch._id} className='border-2 border-white hover:border-slate-300 p-2 odd:bg-slate-200 flex justify-between items-center'>
                  <div>
                    {branch.name}
                  </div>
                    <i className="bi bi-trash-fill text-lg text-red-500 cursor-pointer" onClick={()=> handleBranch(branch)}></i>
                </div>)
              }
            </div>
          </div>
        </div>
      </DashboardWrapper>
    {
      addBranch && 
      <Confirmation color="bg-blue-500">
        <p className="text-lg font-semibold text-center px-5">You want to add this branch?</p>
        <div className="flex gap-5">
          <button className="bg-blue-500 border-2 border-blue-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-blue-500 duration-200 ease-in-out" onClick={handleSubmitAdd}>Yes</button>
          <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setAddBranch(false)}>No</button>
        </div>
      </Confirmation>
    }
    {
      success &&
      <Notification color="bg-blue-500" transitions={success} success={()=> setSuccess(false)}>
        Branch Successfully Added.
      </Notification>
    }
    {
      deleteBranch && 
      <Confirmation color="bg-red-500">
        <p className="text-lg font-semibold text-center px-5">You want to delete {branch.name}?</p>
        <div className="flex gap-5">
          <button className="bg-red-500 border-2 border-red-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-red-500 duration-200 ease-in-out" onClick={handleSubmitDeleteBranch}>Yes</button>
          <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setDeleteBranch(false)}>No</button>
        </div>
      </Confirmation>
    }
    {
      successDeleteBranch &&
      <Notification color="bg-red-500" transitions={successDeleteBranch} success={()=> setSuccessDeleteBranch(false)}>
        Branch Successfully Deleted.
      </Notification>
    }
    </>
  )
}
