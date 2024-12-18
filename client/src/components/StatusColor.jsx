/* eslint-disable react/prop-types */


export const StatusColor = ({isOpen, ticket}) => {
  return (
    <div>
      <i className={`bi bi-circle-fill${((!isOpen) ? " text-green-500" : "")}${((isOpen && ticket?.is_declined)? " text-red-500" : "")}${((isOpen && !ticket?.aom_approval_details?.is_approve_aom && !ticket?.is_declined && !ticket?.semi_approved_details?.is_approve_semi) ? " text-cyan-300" : "")}${((isOpen && ticket?.aom_approval_details?.is_approve_aom && !ticket?.semi_approved_details?.is_approve_semi && !ticket?.oos) ? " text-indigo-700": "")}${((isOpen && !ticket?.last_approval_details?.last_approval && !ticket?.is_declined && !ticket?.verified_details?.is_verified && !ticket?.oos && ticket?.semi_approved_details?.is_approve_semi && !ticket?.fraud_details?.is_fraud && ticket?.request === "SIM") ? " text-yellow-500": "")}${((isOpen && !ticket?.last_approval_details?.last_approval && !ticket?.is_declined && (!ticket?.purchasing_approval?.new_items && !ticket?.purchasing_approval?.used_items) && !ticket?.oos && ticket?.semi_approved_details?.is_approve_semi && !ticket?.fraud_details?.is_fraud && ticket?.request === "HANDSET") ? " text-lime-500": "")}${((isOpen && (ticket?.oos || ticket?.purchasing_oos.oos) && (!ticket?.verified_details?.is_verified && (!ticket?.purchasing_approval?.new_items && !ticket?.purchasing_approval?.used_items))) ? " text-orange-500" : "")}${((isOpen && !ticket?.complete_details?.is_complete && !ticket?.last_approval_details?.last_approval) ? " text-blue-500" : "")}${((isOpen && ticket?.fraud_details?.is_fraud) ? " text-orange-800" : "")}${((ticket?.last_approval_details?.last_approval && !ticket?.complete_details?.is_complete && isOpen) ? " text-black" : "")}${((!ticket?.complete_details?.is_complete && !ticket?.fraud_details?.is_fraud) ? " animate-pulse" : "")}`}></i>
    </div>
  )
}
