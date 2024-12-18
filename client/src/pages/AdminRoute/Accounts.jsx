/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom"
import { Notification } from "../../components/Notification"
import { useEffect, useState } from "react"
import { useAllUsersQuery } from "../../redux/api/user"
import { useDispatch, useSelector } from "react-redux"
import { setAllUsers } from "../../redux/features/auth/authSlice"

export const Accounts = () => {
  const navigate = useNavigate()
  const [successfully, setSuccessfully] = useState(false)
  const {allUsers} = useSelector((state)=> state.auth)
  const {data: allUsersQuery,refetch:allUsersRefetch} = useAllUsersQuery()
  const dispatch = useDispatch()
  const [successUpdate, setSuccessUpdate ] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [search, setSearch] = useState('')
  const [resetPass, setResetPass] = useState(false)

  useEffect(()=> {
    
    allUsersRefetch()
  })

  useEffect(()=> {
    dispatch(setAllUsers(allUsersQuery))
  },[allUsersQuery])

  useEffect(()=> {
    if(window.location.search === "?new=true") {
      setSuccessfully(true)
    } else if(window.location.search === "?updated=true") {
      setSuccessUpdate(true)
    } else if(window.location.search === "?isOnline=false") {
      setIsOnline(true)
    } else if(window.location.search === "?resetPass=true") {
      setResetPass(true)
    }
  },[window.location.search])

  useEffect(()=> {
    navigate('/accounts')
  },[successfully,successUpdate])

  const handleSearch = (e)=> {
    setSearch(e.target.value)
  }


  return (
    <>
      <div className="col-span-6 flex flex-col overflow-y-auto bg-white rounded shadow-md shadow-black/50 relative w-full h-full overflow-x-hidden">
        <div className="relative">
          <div className="flex flex-col justify-between sticky top-0 bg-white p-2">
            <div className="flex justify-between">
              <p className="text-3xl font-semibold  ">Accounts</p>
              <div className="flex gap-10">
                <input type="text" value={search} placeholder="Search" className="border-2 py-1 px-2 rounded-md " onChange={handleSearch} />
              </div>
            </div>
            <hr className="mt-1 border border-black" />
            <div className="px-2 py-2 grid grid-cols-7 text-center font-bold">
              <div className="col-span-2">Name</div>
              <div>Department</div>
              <div>Branch</div>
              <div className="col-span-2">Username</div>
              <div>Is Online</div>
            </div>
            <hr  className="mb-1 border border-black"/>
          </div>

          <div className="w-full rounded h-full  px-2">
            <div className="w-full">
              {
                allUsers?.map((user) => <Link to="/user-account" state={user} key={user._id} className="grid grid-cols-7 text-center py-2.5 border-2 border-white hover:border-slate-400 odd:bg-slate-200 cursor-pointer">
                  <div className="col-span-2">
                    {user.name.toUpperCase()}
                  </div>
                  <div>
                    {user.department}
                  </div>
                  <div>
                    {user.branch}
                  </div>
                  <div className="col-span-2">
                    {user.username.toUpperCase()}
                  </div>
                  <div>
                    <i className={`bi bi-circle-fill${user.isOnline ? " text-green-500" : ""} `}></i>
                  </div>
                </Link>)
              }
            </div>
          </div>
        </div>
      </div>
        {
          successfully && 
          <Notification color="bg-blue-500" transitions={successfully} success={()=> setSuccessfully(false)} >
            <p>New Account Successfully Added</p>
          </Notification>
        }
        {
          successUpdate && 
          <Notification color="bg-orange-500" transitions={successUpdate} success={()=> setSuccessUpdate(false)} >
            <p>Account Successfully Updated</p>
          </Notification>
        }
        {
          isOnline && 
          <Notification color="bg-green-500" transitions={isOnline} success={()=> setIsOnline(false)} >
            <p>Account Successfully Offline</p>
          </Notification>
        }
        {
          resetPass && 
          <Notification color="bg-green-500" transitions={resetPass} success={()=> setResetPass(false)} >
            <p>Account Password Successfully Reset </p>
          </Notification>
        }
    </>
  )
}
