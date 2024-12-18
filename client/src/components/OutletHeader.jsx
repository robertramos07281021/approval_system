/* eslint-disable react/prop-types */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export const OutletHeader = ({title}) => {


  const navigate = useNavigate()
  
  const [status, setStatus] = useState(false)


  const handleOpenStatus = ()=> {
    setStatus(true)
  }
  const handleCloseStatus = ()=> {
    setStatus(false)
  }

  useEffect(()=> {
    setStatus(false)
  },[navigate])
  return (

    <>
      <p className="xs:text-2xl lg:text-3xl font-semibold">{title}</p>
      <div className="flex gap-2 lg:hidden">
        Status
        {
          status ? (
            <i className="bi bi-caret-up-fill" onClick={handleCloseStatus}></i>
          ) : (
            <i className="bi bi-caret-down-fill" onClick={handleOpenStatus}></i>
          )
        }
      </div>
      <div className="flex-col items-end xs:hidden lg:flex">
        <div className="flex lg:text-[0.5rem] 2xl:text-xs">
          <p className="pr-2 font-bold">STATUS :</p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-green-500 text-xs"></i>
            <span>- New /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-red-500 text-xs"></i>
            <span>- Reject /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-cyan-300 text-xs"></i>
            <span>- AOM Approval /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-indigo-700 text-xs"></i>
            <span>- Ms. Wendy Approval /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-lime-500 text-xs"></i>
            <span>- Purchasing Ver /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-yellow-300 text-xs"></i>
            <span>- IT Verification /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-orange-500 text-xs"></i>
            <span>- Out of stock /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-blue-500 text-xs"></i>
            <span>- Ms. Ethel Approval /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 animate-pulse text-xs"></i>
            <span>- Receiving /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-xs"></i>
            <span>- Complete /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-xs text-orange-800"></i>
            <span>- Fraud</span>
          </p>
        </div>
      </div>
      {
        status &&
      <div className="h-auto p-2 absolute right-7 top-5 z-50 border shadow- bg-white w-40 text-xs">
          <p className="pr-2 font-bold">STATUS :</p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-green-500 text-xs"></i>
            <span>- New</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-red-500 text-xs"></i>
            <span>- Reject</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-cyan-300 text-xs"></i>
            <span>- AOM Approval</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-indigo-700 text-xs"></i>
            <span>- Ms. Wendy Approval</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-lime-500 text-xs"></i>
            <span>- Purchasing Ver /&nbsp;</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-yellow-300 text-xs"></i>
            <span>- IT Verification</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-orange-500 text-xs"></i>
            <span>- Out of stock</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-blue-500 text-xs"></i>
            <span>- Ms. Ethel Approval</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 animate-pulse text-xs"></i>
            <span>- Receiving</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-xs"></i>
            <span>- Complete</span>
          </p>
          <p>
            <i className="bi bi-circle-fill pr-2 text-xs text-orange-800"></i>
            <span>- Fraud</span>
          </p>

      </div>
      }
    </>
  )
}
