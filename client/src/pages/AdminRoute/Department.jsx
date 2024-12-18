/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { useAddDepartmentMutation, useAllDepartmentQuery, useDeleteDepartmentMutation, useUpdateDepartmentMutation } from "../../redux/api/department"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"
import { useDispatch, useSelector } from "react-redux"
import { removeDept, setDept, setDepts } from "../../redux/features/dept/deptSlice"
import { useNavigate } from "react-router-dom"



export const Department = () => {
  const {dept, depts} = useSelector((state)=> state.dept)
  const [newDepartment] = useAddDepartmentMutation()
  const [deptName, setDeptName] = useState("")
  const [required, setRequired] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [success, setSuccess] = useState(false)
  const {data: allDepts, refetch:allDeptsRefetch} = useAllDepartmentQuery()
  const [deleteData, setDeleteData] = useState(false)
  const [deleteDept] = useDeleteDepartmentMutation()
  const [successDelete, setSuccessDelete] = useState(false)
  const [updateName, setUpdateName] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState(false)
  const [updateDept] = useUpdateDepartmentMutation()
  const [successUpdate, setSuccessUpdate] = useState(false)
  const [isUpdateModal, setIsUpdateModal] = useState(false)
  const [requiredUpdate, setRequiredUpdate] = useState(false)
  const handleSubmit = () => {
    if(deptName.trim() !== "") {
      setSubmit(true)
    } else {
      setRequired(true)
   
    }
  }

  useEffect(()=> {
    dispatch(setDepts(allDepts))
  },[allDepts,allDeptsRefetch])

  
  const handleSubmitNewDept = async()=> {
    const res = await newDepartment({name: deptName})
  
    if(!res.error) {
      setSuccess(true)
      setRequired(false)
      setSubmit(false)
      setDeptName("")
      dispatch(removeDept())
      allDeptsRefetch()
    } else {
      if(res.error?.data?.message === "Danger") {
        navigate('/danger?error=Danger')
      }
    }
  }

  //for updating ==============
  const handleUpdate = (dept) => {
    dispatch(setDept(dept))
    setIsUpdate(true)
    setUpdateName(dept.name)
  }

  const cancelUpdate = () => {
    dispatch(removeDept())
    setIsUpdate(false)
  }

  const handleIsUpdateModel = ()=> {
    if(updateName.trim() === "") {
      setRequiredUpdate(true)
    } else {
      setIsUpdateModal(true)
      setRequiredUpdate(false)
    }
  }

  const handleSubmitUpdate = async() => {
    const res = await updateDept({id: dept._id, name: updateName})
    console.log(dept)
    if(!res.error) {
      setUpdateName("")
      setSuccessUpdate(true)
      allDeptsRefetch()
      setIsUpdate(false)
      dispatch(removeDept())
      setIsUpdateModal(false)
    } else {
      if(res.error?.data?.message === "Danger") {
        navigate('/danger?error=Danger')
      }
    }
  }


  //for deleting ====================
  const handleDelete = (dept) => {
    setDeleteData(true)
    dispatch(setDept(dept))
    setIsUpdate(false)
  }

  const handleDeleteData = async() => {
    const res = await deleteDept(dept._id)
    if(!res.error) {
      setSuccessDelete(true)
      setDeleteData(false)
      allDeptsRefetch()
      dispatch(removeDept())
    } 
  }


  return (
    <>
    <DashboardWrapper>
      <div className="grid grid-cols-3 gap-2 h-full">
      
        <div className="flex bg-white col-span-2  flex-col">
          <div className="text-3xl font-semibold">Departments</div>
          <div className="overflow-y-auto min-h-[95%] h-[540px] flex flex-col px-2 ">
              {depts?.map((dept)=><div key={dept._id} className="py-2 px-4 odd:bg-slate-200/80 hover:border-slate-400 border-2 border-white flex justify-between">
              <div>
                {dept.name}
              </div>
              <div className="flex gap-10">
                <i className="bi bi-pencil-square  text-green-500 cursor-pointer text-lg " onClick={()=> handleUpdate(dept)}></i>
                <i className="bi bi-trash3-fill font-bold text-red-500 text-lg cursor-pointer text-center" onClick={()=> handleDelete(dept)} ></i>
              </div>
              
              </div>)}
          </div>
         
        </div>
        <div className=" grid grid-rows-2 gap-2">
          <div className="border shadow-sm shadow-black/40 rounded flex justify-center items-center px-10 flex-col gap-5">
            <h1 className="font-bold text-2xl">Create New Department</h1>
            {
              required &&
              <p className="text-red-500 text-xs font-bold">Department name is required</p>
            }

            <label>
              <span className="font-semibold">Department Name:</span>
              <input type="text" value={deptName} onChange={(e)=> setDeptName(e.target.value)} className="border-2 rounded border-slate-200 w-full p-2" placeholder="Enter new Name"/>
            </label>
            <button className="border-2 py-2 px-10 font-bold bg-blue-500 text-white border-blue-500 rounded hover:bg-white hover:text-blue-500 duration-200 ease-in-out" onClick={handleSubmit}>Submit</button>
          </div>
          <div className="border shadow-sm shadow-black/40 rounded flex justify-center items-center px-10 flex-col gap-5">
            <h1 className="font-bold text-2xl">Update Department</h1>
            {
              isUpdate &&
            <h1 className="font-bold">{dept.name}</h1>
            }
            {
              requiredUpdate &&
              <p className="text-red-500 text-xs font-bold">Department name is required</p>
            }
            <label>
              <span className="font-semibold">New Department Name:</span>
              <input type="text" value={updateName} onChange={(e)=> setUpdateName(e.target.value)} className="border-2 rounded border-slate-200 w-full p-2" placeholder="Enter New Name" disabled={!isUpdate}/>
            </label>
            {
              isUpdate &&
            <div className="flex gap-5">
              <button className="border-2 py-2 w-36 font-bold bg-green-500 text-white border-green-500 rounded hover:bg-white hover:text-green-500 duration-200 ease-in-out" onClick={handleIsUpdateModel}>Update</button>
              <button className="border-2 py-2 w-36 font-bold bg-slate-500 text-white border-slate-500 rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={cancelUpdate}>Cancel</button>
            </div>
            }
          </div>
        </div>
      </div>
       
    </DashboardWrapper>
    {
      submit &&
    <Confirmation color="bg-blue-500">
       <p className="text-lg font-semibold text-center px-5">You want to add this department?</p>
          <div className="flex gap-5">
            <button className="bg-blue-500 border-2 border-blue-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-blue-500 duration-200 ease-in-out" onClick={handleSubmitNewDept}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmit(false)}>No</button>
          </div>
    </Confirmation>
    }
    {
      successDelete &&
      <Notification color="bg-red-500" transitions={successDelete} success={()=> setSuccessDelete(false)}>
        Department Successfully Deleted.
      </Notification>
    }
    {
      deleteData &&
    <Confirmation color="bg-red-500">
       <p className="text-lg font-semibold text-center px-5">You want to delete this department?</p>
          <div className="flex gap-5">
            <button className="bg-red-500 border-2 border-red-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-red-500 duration-200 ease-in-out" onClick={handleDeleteData}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> {setDeleteData(false); dispatch(removeDept())}}>No</button>
          </div>
    </Confirmation>
    }
    {
      success &&
      <Notification color="bg-blue-500" transitions={success} success={()=> setSuccess(false)}>
        Department Successfully Added.
      </Notification>
    }
    {
      isUpdateModal &&
    <Confirmation color="bg-green-500">
       <p className="text-lg font-semibold text-center px-5">You want to update this department?</p>
          <div className="flex gap-5">
            <button className="bg-green-500 border-2 border-green-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-green-500 duration-200 ease-in-out" onClick={handleSubmitUpdate}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> {setIsUpdateModal(false); dispatch(removeDept())}}>No</button>
          </div>
    </Confirmation>
    }
    {
      successUpdate &&
      <Notification color="bg-green-500" transitions={successUpdate} success={()=> setSuccessUpdate(false)}>
        Dept Successfully Updated.
      </Notification>
    }
    </>
  )
}
