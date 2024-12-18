/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useLoginMutation, useLogoutMutation, useUpdateItIsOnlineMutation } from "../redux/api/user"
import { useLocation, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { logout, setCredentials } from "../redux/features/auth/authSlice"

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [login,{isLoading}] = useLoginMutation()
  // =================  credencials error
  const [required, setRequired] = useState(false)
  const [incorrect, setIncorrect] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  //middlewares
  const {userInfo} = useSelector((state)=> state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {search} = useLocation()
  const [logoutUser] = useLogoutMutation()
  const [updateItIsOnline] = useUpdateItIsOnlineMutation()

  useEffect(()=> {
    setTimeout(async()=> {
      if(search) {
        await updateItIsOnline(search.substring(10,(search.length + 1)))
      }
    })
    navigate('/')
  },[search])

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!username || !password) {
      setRequired(true)
      setIsLogin(false)
      setIncorrect(false)
    } else {
      setRequired(false)
      const res = await login({ username,password})
      if(!res?.error) {
          dispatch(setCredentials({...res?.data}))
          if(res?.data.type === "ADMIN" && window.innerWidth > 1023) {
            navigate('../admin-dashboard')
          } else if(res?.data.type === "USER" && window.innerWidth > 1023) {
            navigate('../user-dashboard')
          } else if(res?.data.type === "AOM" && window.innerWidth > 1023) {
            navigate("../aom-dashboard") 
          } else if(res?.data.type === "APPROVER"){
            navigate("../approver-dashboard")
          } else if(res?.data.type === "SEMI-APPROVER" && window.innerWidth > 1023){
            navigate("../semi-approver-dashboard")
          } else if(res?.data.type === "PURCHASING" && window.innerWidth > 1023){
            navigate("../purchasing-dashboard")
          } else if((userInfo?.type !== "APPROVER" && window.innerWidth < 1024)) {
            navigate("/danger?error=Danger")
            setTimeout(async()=> {
              await logoutUser(res?.data._id)
              dispatch(logout())
            })
          }
        } else {
          if(res.error.data.message === 'Incorrect username or password') {
            setIncorrect(true)
          setRequired(false)
          setIsLogin(false)
        }
        if(res.error.data.message === "Account is already logged in" ) {
          setIsLogin(true)
          setRequired(false)
          setIncorrect(false)
        }
        if(res.error?.data?.message === "Danger") {
          navigate('/danger?error=Danger')
        }
      }
    }
  }
  
  const [transition, setTransiction] = useState("-translate-y-8 opacity-0")

  useEffect(()=> {
    setTimeout(()=> {
      setTransiction("-translate-y-0 opacity-100")
    })
  },[navigate])


  useEffect(()=> {
    setTimeout(async()=> {
      if(userInfo?.type === "ADMIN") {
        navigate('../admin-dashboard')
      } else if(userInfo?.type === "USER" ) {
        navigate("../user-dashboard")
      } else if(userInfo?.type === "SEMI-APPROVER" ) {
        navigate("../semi-approver-dashboard")
      } else if(userInfo?.type === "AOM" ){
        navigate("../aom-dashboard")
      } else if(userInfo?.type === "PURCHASING" ){
        navigate("../purchasing-dashboard")
      } else if(userInfo?.type === "APPROVER"){
        navigate("../approver-dashboard")
      }
    })

  },[navigate])

  const [passShow, setPassShow] = useState(false)
  const handleShowPass = () => {
    setPassShow(!passShow)
  }

  return (
    <div style={{backgroundImage: `url(/001.jpg)`}} className="w-full mix-blend-lighten min-h-screen bg-fixed bg-no-repeat bg-cover flex items-center justify-center relative">
        <div className="absolute w-full h-full bg-blue-500/60 backdrop-blur-sm z-10">
        </div>
        {!isLoading ? (<div className={`  lg:w-9/12 2xl:w-7/12 min-h-[600px] grid lg:grid-cols-2 bg-cover z-20 rounded-md shadow-lg shadow-black/80 overflow-hidden font-sans transition-all duration-1000 ease-in-out ${transition}`}  style={{backgroundImage: `url(/005.jpg)`}}>
          <div className=" bg-white w-full flex items-center justify-center flex-col px-16 border gap-5">
            <div className="lg:hidden flex flex-col gap-2">
              <img src="/bernalesLogo.png" className="" />
              <div className="flex justify-center gap-5">
                <a href="https://www.facebook.com/bernalesandassociatesofficial" target="_black">
                  <div className="border-2 border-white flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                    <i className="bi bi-facebook text-xl text-white"></i>
                  
                  </div>
                </a>
                <a href="https://ph.linkedin.com/company/bernalesandassociates" target="_black">
                  <div className="border-2 border-white flex items-center justify-center p-1 w-10 h-10 bg-blue-800 rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                    <i className="bi bi-linkedin text-xl text-white"></i>
                  </div>
                </a>
                <a href="https://www.tiktok.com/@bernalesandassociates/photo/7433999715332541704?is_from_webapp=1&sender_device=pc" target="_black">
                  <div className="border-2 border-white flex items-center justify-center p-1 w-10 h-10 bg-blue-800 rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                    <i className="bi bi-tiktok text-xl text-white"></i>
                  </div>
                </a>
                <a href="https://www.instagram.com/p/DCA7BUkBGK2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_black">
                  <div className="border-2 border-white flex items-center justify-center p-1 w-10 h-10 bg-blue-800 rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                    <i className="bi bi-instagram text-xl text-white"></i>
                  </div>
                </a>
              </div>
            </div>

            <p className="text-2xl font-bold text-blue-800 ">LOGIN</p>
            {
              required && 
              <p className="text-center text-red-500 font-bold text-xs">All fields are required!</p>
            }
            {
              incorrect &&
              <p className="text-center text-red-500 font-bold text-xs">Incorrect Username or Password</p>
            }
            {
              isLogin &&
              <p className="text-center text-red-500 font-bold text-xs">Your account is already logged in.</p>
            }

            {/* ================= Login Form ====================== */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="">
                <span className="font-semibold text-lg">Username: </span>
                <input type="text" className="w-full p-2 border rounded border-blue-900  focus:border-2 focus:outline-none" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </label>
              <label className="relative">
                <span className="font-semibold text-lg">Password: </span>
                <input type={passShow ? "text" : "password"} className="w-full p-2 border rounded border-blue-900  focus:border-2 outline-none" placeholder="Enter Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                  {
                    passShow ? (
                      <i className="bi bi-eye-slash-fill absolute text-xl top-9 right-4" onClick={handleShowPass}></i>
                    ) : ( 
                      <i className="bi bi-eye-fill absolute text-xl top-9 right-4" onClick={handleShowPass}></i>
                    )
                  }
              </label>
              <button className="text-white bg-blue-800 font-semibold py-2 rounded mt-10 border-2 border-blue-800 hover:text-blue-800 hover:bg-white duration-100 shadow-md shadow-black/50">Submit</button>
            </form>
          </div>
          {/*========================== Right Side Division========================== */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-5 " >
            <img src="/bernalesLogo.png" alt="" className="shadow-md shadow-black rounded-md lg:w-72 xl:w-auto"/>
            <div className="flex gap-5 ">
              <a href="https://www.facebook.com/bernalesandassociatesofficial" target="_black">
                <div className="border-2 border-white flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                  <i className="bi bi-facebook text-xl text-blue-800"></i>
                </div>
              </a>
              <a href="https://ph.linkedin.com/company/bernalesandassociates" target="_black">
                <div className="border-2 border-white flex items-center justify-center p-1 w-10 h-10 bg-white rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                  <i className="bi bi-linkedin text-xl text-blue-800"></i>
                </div>
              </a>
              <a href="https://www.tiktok.com/@bernalesandassociates/photo/7433999715332541704?is_from_webapp=1&sender_device=pc" target="_black">
                <div className="border-2 border-white flex items-center justify-center p-1 w-10 h-10 bg-white rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                  <i className="bi bi-tiktok text-xl text-blue-800"></i>
                </div>
              </a>
              <a href="https://www.instagram.com/p/DCA7BUkBGK2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_black">
                <div className="border-2 border-white flex items-center justify-center p-1 w-10 h-10 bg-white rounded-full shadow-md shadow-black hover:scale-105 duration-100 ease-in-out">
                  <i className="bi bi-instagram text-xl text-blue-800"></i>
                </div>
              </a>
            </div>
          </div>
        </div>) : (
          <div className="border-8 border-dotted animate-spin w-20 h-20 border-black rounded-full z-50"></div>
        )}
    </div>
  )
}
