/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import { DateFormat } from "./DateFormat"


export const RequestInformationModal = ({children, ticket}) => {
  const {userInfo} = useSelector((state) => state.auth)

  return (
    <>
      <h1 className="xs:text-lg lg:text-2xl font-bold pt-2 w-full text-center bg-blue-500 text-white h-28 flex items-center justify-center">Request Info</h1>
      <div className="w-full h-full  overflow-y-auto xs:p-3 lg:p-10 gap-5 flex flex-col">
        <div className="flex gap-2 xs:text-sm lg:text-lg">
          <h1 className="font-bold">Ticket No : </h1>
          <p>{ticket?.ticket_no}</p>
        </div>

        <div className="flex flex-col border-4 border-b-0 lg:text-base xs:text-xs">
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Status :</div>

            <div className="w-full p-3 font-black">
              {
                !ticket?.aom_approval_details?.is_approve_aom && ticket?.is_declined  && 
                <p className="text-red-500">Reject</p>
              }
              {
                !ticket?.aom_approval_details?.is_approve_aom && !ticket?.is_declined && !ticket?.verified_details?.is_verified && 
                <p className="text-cyan-500">For AOM Approval</p>
              }
              {
                ticket?.aom_approval_details?.is_approve_aom && !ticket.is_declined && !ticket.semi_approved_details?.is_approve_semi && !ticket.oos &&
                <p className="text-indigo-700">For Ms Wendy Approval</p>
              }
              {
                ticket?.semi_approved_details?.is_approve_semi && !ticket?.is_declined && !ticket?.verified_details?.is_verified && !ticket?.oos && !ticket.fraud_details?.is_fraud && ticket?.request === "SIM" &&
                <p className="text-yellow-500">For IT Verification</p>
              }
              {
                ticket?.semi_approved_details?.is_approve_semi && !ticket?.is_declined && (!ticket?.purchasing_approval?.new_items && !ticket?.purchasing_approval?.used_items) && !ticket?.oos && !ticket.fraud_details?.is_fraud && ticket?.request === "HANDSET" &&
                <p className="text-lime-500">Purchasing Approval</p>
              }
              {
                ticket?.oos && !ticket?.verified_details?.is_verified &&
                <p className="text-orange-500">Out of Stock</p>
              }
              {
                (ticket?.verified_details?.is_verified || ticket?.purchasing_approval?.new_items || ticket?.purchasing_approval?.used_items) && !ticket?.last_approval_details?.last_approval && !ticket?.fraud_details?.is_fraud &&
                <p className="text-blue-500">For Ms Ethel Approval</p>
              }
              {
                ticket?.fraud_details?.is_fraud &&
                <p className="text-orange-800">Fraud</p>
              }
              {
                ticket?.last_approval_details?.last_approval && !ticket?.complete_details?.is_complete &&
                <p className="text-black">For Receiving</p>
              }
              {
                ticket?.complete_details?.is_complete && !ticket?.fraud_details?.is_fraud &&
                <p className="text-black">Complete</p>
              }
            </div>

          </div>
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Employee Name :</div>
            <div className="w-full  p-3 ">{ticket?.employee_name?.toUpperCase()}</div>
          </div>
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Position :</div>
            <div className="w-full  p-3 ">{ticket?.position?.toUpperCase()}</div>
          </div>
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Department :</div>
            <div className="w-full  p-3 ">{ticket?.department}</div>
          </div>
          {
            userInfo.type !== "AOM" &&
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Branch :</div>
            <div className="w-full  p-3 ">{ticket?.branch}</div>
          </div>
          }
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Request :</div>
            <div className="w-full  p-3 ">{ticket?.request}</div>
          </div>
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Quantity :</div>
            <div className="w-full  p-3 ">{ticket?.qty}</div>
          </div>
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Requested Date :</div>
            <div className="w-full  p-3 ">
              <DateFormat date={ticket?.createdAt}/>
            </div>
          </div>
          <div className="flex border-b-4">
            <div className="w-full border-r-4 p-3 font-bold">Purpose :</div>
            <div className="w-full  p-3 h-44 text-justify ">
              {ticket?.purpose}
            </div>
          </div>
          
          { ticket?.declined_details?.length > 0 && 
            <div className="flex border-b-4">
              <div className="w-full border-r-4 p-3 font-bold">Reject Details :</div>
              <div className={`w-full p-3 overflow-y-auto h-96`}>
              {
                ticket?.declined_details.map((comment,index) => <div key={comment._id} className={`flex flex-col ${ticket?.declined_details?.length !== (index + 1) && "border-b-2" }`}>
                  <div className="flex">
                    { 
                      (index + 1) + ". "
                    }<DateFormat date={comment.declined_date}/>
                  </div>
                  <div className="indent-5 text-justify text-sm ">
                    Rejected by : {comment.declined_by}
                  </div>
                  <div className="indent-5 text-justify text-sm ">
                    Reason : {comment.declined_reason}
                  </div>
                </div>)
              }
              </div>
            </div>
          } 
          {
            ticket?.aom_approval_details?.is_approve_aom &&
            <>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">AOM Approved Date :</div>
                <div className="w-full  p-3">
                  <DateFormat date={ticket?.aom_approval_details?.approve_date_aom}/>
                </div>
              </div>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">AOM Comment :</div>
                <div className={`w-full overflow-y-auto p-3 ${ticket?.aom_approval_details?.aom_approved_comments && "h-44" }  `}>
                  {
                  ticket?.aom_approval_details?.aom_approved_comments ? ticket?.aom_approval_details?.aom_approved_comments : "N/A"
                  }</div>
              </div>
            </>
          }
          {
            ticket?.semi_approved_details?.is_approve_semi && 
            <>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Ms Wendy Approval Date :</div>
                <div className="w-full  p-3">
                  <DateFormat date={ticket?.semi_approved_details?.semi_approved_date}/>
                </div>
              </div>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Ms Wendy Comment :</div>
                <div className={`w-full overflow-y-auto p-3 ${ticket?.semi_approved_details?.semi_approved_comment && "h-44" }  `}>
                  {
                  ticket?.semi_approved_details?.semi_approved_comment ? ticket?.semi_approved_details?.semi_approved_comment : "N/A"
                  }</div>
              </div>
            </>
          }
          {
            (ticket?.oos || ticket?.purchasing_oos?.oos) && userInfo.type !== "ADMIN" && userInfo.type !== "PURCHASING" && 
            <div className="border-b-4 flex ">
              <div className="w-full border-r-4 p-3 font-bold">Out of Stock Comment :</div>
              <div className={`w-full p-3 overflow-y-auto${ticket.oos_comment || ticket.purchasing_oos.oos_comment  ? " h-44" : ""}`}>
                {
                  ticket.oos_comment ? (
                    <>
                      {
                        ticket.oos_comment ? ticket?.oos_comment : "N/A"
                      }
                    </>
                  ): (
                    <>
                      {
                        ticket.purchasing_oos.oos_comment ? ticket.purchasing_oos.oos_comment : "N/A"
                      }
                    </>
                  )    
                }
              </div>
            </div>
          }
          {
            ticket?.verified_details?.is_verified &&
            <>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Verified Date :</div>
                <div className="w-full  p-3 ">
                  <DateFormat date={ticket?.verified_details?.verified_date}/>
                </div>
              </div>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Verification Comment :</div>
                <div className={`w-full overflow-y-auto p-3${ticket?.verified_details?.verified_comment ? " h-44" : ""}`}>
                  {
                    ticket?.verified_details?.verified_comment ? ticket?.verified_details?.verified_comment : "N/A"
                  }
                </div>
              </div>
            </>
          }
          {
            (ticket?.purchasing_approval?.new_items || ticket?.purchasing_approval?.used_items) &&
            <>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Purchasing Approval Date :</div>
                <div className="w-full  p-3 ">
                  <DateFormat date={ticket?.purchasing_approval?.purchasing_approval_date}/>
                </div>
              </div>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Purchasing Item To Deploy :</div>
                <div className="w-full  p-3 ">
                  {
                    ticket?.purchasing_approval.new_items && "New Item"
                  }
                  {
                    ticket?.purchasing_approval.used_items && "Used Item"
                  }
                </div>
              </div>
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Purchasing Comment :</div>
                <div className={`w-full overflow-y-auto p-3${ticket?.purchasing_approval?.purchasing_comment ? " h-44" : ""}`}>
                {
                  ticket?.purchasing_approval?.purchasing_comment ? ticket?.purchasing_approval?.purchasing_comment : "N/A"
                }
                </div>
              </div>
            </>
          }
          {
            ticket?.fraud_details?.is_fraud && (
              <>
                <div className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Fraud Date :</div>
                  <div className="w-full  p-3 ">
                    <DateFormat date={ticket?.fraud_details?.fraud_date}/>
                  </div>
                </div>
                <div className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Fraud Comment :</div>
                  <div className="w-full  p-3 h-44 overflow-y-auto border-r-2">
                    {ticket?.fraud_details?.fraud_comment}
                    </div>
                </div>
                <div className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Fraud By :</div>
                  <div className="w-full  p-3 ">{ticket?.fraud_details?.fraud_by.toUpperCase()}</div>
                </div>
              </>
            )
          }
          {
            ticket?.last_approval_details?.last_approval && (
              <>
                <div className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Ms Ethel Approved Date :</div>
                  <div className="w-full  p-3 ">
                    <DateFormat date={ticket?.last_approval_details?.last_approve_date}/>
                  </div>
                </div>
                <div className={`flex border-b-4`}>
                  <div className="w-full border-r-4 p-3 font-bold">Ms Ethel Comment :</div>
                  <div className={`w-full overflow-y-auto p-3${ticket?.last_approval_details?.last_approval_comment ? " h-44" : ""}`}>
                    {
                      ticket?.last_approval_details?.last_approval_comment ? ticket?.last_approval_details?.last_approval_comment : "N/A"
                    }
                  </div>
                </div>
              </>
            )
          }
          {
            ticket?.complete_details?.is_complete && (
              <>
                <div className="flex border-b-4 ">
                  <div className="w-full border-r-4 p-3 font-bold">Received Date :</div>
                  <div className="w-full p-3 ">
                    <DateFormat date={ticket?.complete_details?.complete_date}/>
                  </div>
                </div>
                <div className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Received Comment :</div>
                  <div className={`w-full  p-3 ${ticket?.complete_details?.complete_comment && "h-44"}`}>
                    {
                      ticket?.complete_details?.complete_comment ? ticket?.complete_details?.complete_comment : "N/A"
                    }
                  </div>
                </div>
                <div className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Received By :</div>
                  <div className="w-full  p-3 ">{ticket?.complete_details?.receiver?.toUpperCase()}</div>
                </div>
              </>
            )
          }
          {children}
        </div>
      </div>
    </>
  )
}
