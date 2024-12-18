import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCreateAccountMutation } from "../../redux/api/user"
import { Confirmation } from "../../components/Confirmation"
import { useAllDepartmentQuery } from "../../redux/api/department"
import { useAllBranchesQuery } from "../../redux/api/branch"


export const Register = () => {
  const [create,{isLoading}] = useCreateAccountMutation()
  const [data, setData] = useState({
    name: "",
    department: "",
    email: "",
    type: "",
    branch: "",
    username: "",
    password: "",
    confirmPass: ""
  })
  const {data: allBranches} = useAllBranchesQuery()
  const [submitData, setSubmitData] = useState(false)
  const [required, setRequired] = useState(false)
  const navigate = useNavigate()
  const [notMatched, setNotMatched] = useState(false)
  const [transition, setTransition] = useState("-translate-y-5 opacity-0")
  const {data: allDepts} = useAllDepartmentQuery()

  const handleSubmit = (e) => {
    const form = document.querySelector('form')
    e.preventDefault()
    if(!form.checkValidity()) {
      setRequired(true)
    } else {
      setRequired(false)
      if(data.password != data.confirmPass){
        setNotMatched(true)
      } else {
        setNotMatched(false)
        setSubmitData(true)
      }
    }
  }


  const formSubmitdata = async() => {
    const res = await create(data)
    if(!res.error) {
      navigate('/accounts?new=true')
    } else {
      if(res.error?.data?.message === "Danger") {
        navigate('/danger?error=Danger')
      }
    }
  }

  useEffect(()=> {
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
  },[navigate])


  const [passShow, setPassShow] = useState(false)
  const handleShowPass = () => {
    setPassShow(!passShow)
  }

  const [confirm, setConfirm] = useState(false)
  const handleShowConfirm = () => {
    setConfirm(!confirm)
  }

  return (
    <>
      <div className="col-span-6 flex flex-col overflow-y-auto bg-white rounded p-2 shadow-md shadow-black/50 relative w-full h-full">
        <div className="flex justify-between items-center">
          <p className="text-3xl font-semibold"><Link to="/accounts">Accounts</Link><span className="text-sm tracking-wider text-slate-500 ">/ Register</span></p>
        </div>
        <div className="w-full rounded flex items-center justify-center mt-2 h-full ">
          {
            isLoading ? (
              <div className="w-24 h-24 rounded-full border-2 border-dotted border-blue-500 animate-spin"></div>
            ) : (
            <form className={`h-5/6 w-9/12 grid grid-cols-2 gap-x-10 border-2 px-10 rounded-md border-slate-500 shadow-xl shadow-black/20 duration-700 transition-all ease-in-out ${transition}`} onSubmit={handleSubmit} noValidate>
              
              <div className="w-full h-full  flex flex-col justify-center">
                {
                  required &&
                  <p className="text-xs text-red-500 font-bold">All fields are required.</p>
                }
                <label className="w-full">
                  <span className="text-lg font-semibold">Name :</span>
                  <input type="text" className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" value={data.name} onChange={(e)=> setData({...data, name: e.target.value})} required/>
                </label>
                <label className="w-full">
                  <span className="text-lg font-semibold">Email :</span>
                  <input type="email" className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" value={data.email} onChange={(e)=> setData({...data, email: e.target.value})} required/>
                </label>
                <label className="w-full">
                  <span className="text-lg font-semibold">Type :</span>
                  <select className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" onChange={(e)=> setData({...data, type: e.target.value})} required>
                    <option value="">Select Type</option>
                    <option value="USER">User</option>
                    <option value="AOM">AOM</option>
                    <option value="SEMI-APPROVER">Semi-Approver</option>
                    <option value="ADMIN">IT/Admin</option>
                    <option value="APPROVER">Approver</option>
                    <option value="PURCHASING">Purchaser/Admin</option>
                  </select>
                </label>
                <label className="w-full">
                  <span className="text-lg font-semibold">Department :</span>
                  <select className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" onChange={(e)=> setData({...data, department: e.target.value})} required>
                    <option value="">Select Department</option>
                    {
                      allDepts?.map((dept, index)=>
                        <option key={index} value={dept.name.toUpperCase()}>{dept.name.toUpperCase()}</option>
                      )
                    }
                  </select>
                </label>
                <label className="w-full">
                  <span className="text-lg font-semibold">Branch :</span>
                  <select className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" onChange={(e)=> setData({...data, branch: e.target.value})} required>
                    <option value="">Select Branch</option>
                    { allBranches?.map((branch) => <option key={branch._id} value={branch.name} >{branch.name}</option>)}
                  </select>
                </label>
              </div>
  
              <div className="w-full h-full  flex flex-col justify-center">
              {
                  notMatched &&
                  <p className="text-xs text-red-500 font-bold">Confirm password not match on password.</p>
                }
              <label className="w-full">
                  <span className="text-lg font-semibold">Username :</span>
                  <input type="text" className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" onChange={(e)=> setData({...data, username: e.target.value})} pattern="[A-Za-z0-9]{6,30}"  required/>
              </label>
              <label className="w-full relative">
                  <span className="text-lg font-semibold">Password :</span>
                  <input type={passShow ? `text` : "password"} className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" onChange={(e)=> setData({...data, password: e.target.value})} required/>
                  {
                    passShow ? (
                      <i className="bi bi-eye-slash-fill absolute text-xl top-9 right-4" onClick={handleShowPass}></i>
                    ) : ( 
                      <i className="bi bi-eye-fill absolute text-xl top-9 right-4" onClick={handleShowPass}></i>
                    )
                  }
                </label>
              <label className="w-full relative">
                  <span className="text-lg font-semibold">Confirm Password :</span>
                  <input type={confirm ? `text` : "password"} className="w-full border-2 border-slate-300 rounded outline-slate-500 p-2" onChange={(e)=> setData({...data, confirmPass: e.target.value})} required/>
                  {
                    confirm ? (
                      <i className="bi bi-eye-slash-fill absolute text-xl top-9 right-4" onClick={handleShowConfirm}></i>
                    ) : ( 
                      <i className="bi bi-eye-fill absolute text-xl top-9 right-4" onClick={handleShowConfirm}></i>
                    )
                  }
                </label>
              </div>
                  <div className="text-center col-span-2">
                    <button className="py-2 px-16 text-lg bg-blue-500 text-white font-bold border-blue-500 rounded-md hover:bg-white hover:text-blue-500 duration-200 ease-in-out border-2 ">Submit</button>
                  </div>
            </form>
            )
          }
        </div>
        {
          submitData && 
          <Confirmation color="bg-blue-500">
            <p className="text-lg font-semibold">New account created?</p>
            <div className="flex gap-5">
              <button className="bg-blue-500 border-2 border-blue-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-blue-500 duration-200 ease-in-out" onClick={formSubmitdata}>Yes</button>
              <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmitData(false)}>No</button>
            </div>
          </Confirmation>
        }
      </div>
    </>
  )
}
