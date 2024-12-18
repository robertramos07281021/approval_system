import asyncHandler from "../../../middleware/asyncHandler.js";
import Ticket from "../../../model/Ticket.js";
import User from "../../../model/User.js";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: `smtp.gmail.com`,
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: "it_support5@bernales.info",
    pass: "ofwj bxdk umxd lvjc"
  }
})

async function mail (email,subject) {
  await transporter.sendMail({
    from: "it_support5@bernales.info",
    to: email,
    subject: `You have new request notification, for ${subject}`,
    html: `
          <h1>${subject}</h1>
          <br>
          <a href="http://tailwindcss.com/">tailwind</a>
    `
  },function(error, info){
    if (error) {
       console.log(error);
    }
  })
}

// add new ticket
export const addRequest = asyncHandler(async (req, res) => {
  const {employee_name, position, department , request, email, purpose,qty } = req.body
  function ticketNoGenerator() {
    let ticketNo = "";
    const characters = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
    for(let x = 0; x < 8 ; x++) {
      ticketNo = ticketNo += characters.charAt(Math.floor(Math.random() * characters.length) + 1)
    }
    return ticketNo;
  }
  const user = await User.findById(req.user)
  const oam = await User.find({
    $and: [
      {department: user.department},
      {branch: user.branch},
      {type: "AOM"}
    ]
  })
  try {
    const newTicket = await Ticket.create({
      employee_name, position, department , request, email, purpose, qty, ticket_no: ticketNoGenerator(), user: req.user, branch: user.branch
    })
    // oam.email
    if(request === "SIM") {
      mail("robert.ramos07281021@gmail.com","Request").catch(console.error)
    } else {
      mail("toshiramos22@gmail.com","Request").catch(console.error)
    }
    return res.status(200).json(newTicket)
  } catch (error) {
    return res.status(500).json({error: error.message})    
  }
})

//update Ticket isOpen
export const updateTicketOpen = asyncHandler(async( req,res) => {
  const {id} = req.params
  const user = await User.findById(req.user)
  if(!user) return res.status(404).json({message: "User not found"})
  const ticket = await Ticket.findById(id)
  if(!ticket) return res.status(404).json({message: "Ticket not found"})
  if(user.type === "USER") {
    ticket.is_open_object.is_open = true;
  } else if(user.type === "AOM") {
    ticket.is_open_object.is_open_aom = true;
  } else if(user.type === "ADMIN") {
    ticket.is_open_object.is_open_admin = true;
  } else if(user.type === "APPROVER") {
    ticket.is_open_object.is_open_approver = true;
  } else if(user.type === "SEMI-APPROVER") {
    ticket.is_open_object.is_open_semi_approver = true;
  } else if(user.type === "PURCHASING") {
    ticket.is_open_object.is_open_purchaser = true;
  }

  await ticket.save()
  return res.status(200).json({message: "Ticket is already opened"})
})

//user tickets with page query
export const findUserTickets = asyncHandler(async (req,res) => {
  const {page} = req.params
  try {
    const tickets = await Ticket.find({user: req.user}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
    return res.status(200).json(tickets)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//all user Tickets query
export const userTickets = asyncHandler(async(req, res) => {
  try {
    const userTicket = await Ticket.find({user: req.user})
    return res.status(200).json(userTicket)
  } catch (err) {
    return res.status(500).json({error: err.message})
  }
})

//all aom department ticket query
export const aomTickets = asyncHandler(async(req,res) => {
  const user = await User.findById(req.user)
  if(!user) {
    return res.status(404).json({message: "User not found"})
  } 
  try {
    const tickets = await Ticket.find({$and: [{department: {$eq: user.department}},{branch: {$eq: user.branch}}]}).populate('user')
    return res.status(200).json(tickets)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//all aom department ticket with page query
export const aomTicketsWithPage = asyncHandler(async(req, res) => {
  const {page} = req.params
  const user = await User.findById(req.user)
  if(!user) return res.status(404).json({message: "User not found"})
  try {
    const tickets = await Ticket.find({$and: [{department: {$eq: user.department}}, {branch: {$eq: user.branch}}]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1}).populate('user')
    return res.status(200).json(tickets)
  } catch(err) {
    return res.status(500).json({error: err.message})
  }
}) 

//rejecting declining
export const ticketDeclined = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment, name} = req.body
  const ticket = await Ticket.findById(id).populate('user')
  if(!ticket) return res.status(404).json({message: "Ticket not found"})
  mail("robert.ramos07281021@gmail.com","Reject",res)
  try {
    ticket.is_declined = true;
    ticket.aom_approval_details.is_approve_aom = false;
    ticket.aom_approval_details.approve_date_aom = "";
    ticket.declined_details.push({declined_date: new Date(), declined_reason: comment, declined_by: name})
    await ticket.save()
    // ticket.user.email
    return res.status(200).json({message: 'Ticket has been declined'})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//aom ticket approval
export const aomTIcketApproval = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment} = req.body
  const ticket = await Ticket.findById(id)
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  } 

  mail("gray.ramos07281021@gmail.com","Approval").catch(console.error)
  try {
    if(comment.trim() !== ""){
      ticket.aom_approval_details.aom_approved_comments = comment
    } 
    ticket.aom_approval_details.is_approve_aom = true
    ticket.aom_approval_details.approve_date_aom = new Date()
    await ticket.save()
    return res.status(200).json({message: "Ticket approved"})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//user ticket update reattempt
export const userTicketReattempt = asyncHandler(async(req, res) => {
  const {id} = req.params
  const ticket = await Ticket.findByIdAndUpdate(id, {...req.body, is_declined: false, is_open_aom: false}).populate('user')
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  }
  mail("robert.ramos07281021@gmail.com","Re-attempt").catch(console.error)
  const user = await User.findById(ticket.user._id)
  const aom = await User.find({department: user.department, branch: user.branch})
  // aom.email
  return res.status(200).json({message: "Ticket reattempt successfully submit"})
})

//user ticket update 
export const userTicketUpdate = asyncHandler(async (req, res) => {
  const {id} = req.params
  const ticket = await Ticket.findByIdAndUpdate(id, {...req.body})
  if(!ticket) return res.status(404).json({message: "Ticket not found"})
  return res.status(200).json({message: "Ticket successfully update"})
})

//user delete ticket
export const userDeleteTicket = asyncHandler(async (req,res) => {
  const {id} = req.params
  const ticket = await Ticket.findByIdAndDelete(id)
  if(!ticket) return res.status(404).json({message: "Ticket not found"})

  return res.status(200).json({message: "Ticket successfully deleted"})
})

//all tickets
export const allTickets = asyncHandler(async(req, res) => {
  try {
    const tickets = await Ticket.find()
    return res.status(200).json(tickets)
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
} )

//all tickets with page
export const allTicketsWithPage = asyncHandler(async(req, res) => {
  const {page} = req.params
  try {
    const allTicketsWithPage = await Ticket.find().limit(10).skip((page - 1) * 10).sort({createdAt: - 1})
    return res.status(200).json(allTicketsWithPage)
    
  } catch (error) {
    return res.status(500).json({error : error.message})
  }
})

//ticket oos update
export const updateOos = asyncHandler(async (req,res) => {
  const {id} = req.params
  const {comment} = req.body
  const outOfStockTicket = await Ticket.findByIdAndUpdate(id, {oos: true, oos_comment: comment})
  if(!outOfStockTicket) {
    return res.status(404).json({message: "Ticket not found"})
  } 
    // outOfStockTicket.user.email
  mail("robert.ramos07281021@gmail.com","Out Of Stock").catch(console.error)
  return res.status(200).json({message: "Ticket out of stock"})
})

//ticket verified update
export const updateVerify = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment} = req.body
  const ticket = await Ticket.findById(id)
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  }
  mail("toshiramos22@gmail.com","Approval").catch(console.error)
  try {
    if(comment.trim() !== "") {
      ticket.verified_details.verified_comment = comment;
    }
    ticket.verified_details.verified_date = new Date();
    ticket.verified_details.is_verified = true;
    ticket.oos = false;
    await ticket.save()
    return res.status(200).json({message: "Ticket successfully verified"})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//update oos comment
export const updateOosComment = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment} = req.body
  const oosCommentUpdate = await Ticket.findById(id)
  if(!oosCommentUpdate) {
    return res.status(404).json({message: "Ticket not found"})
  }
  if(oosCommentUpdate.request === "SIM") {
    await oosCommentUpdate.updateOne({oos_comment: comment})
  } else if(oosCommentUpdate.request === "HANDSET") {
    await oosCommentUpdate.updateOne({"purchasing_oos.oos_comment": comment})
  }
  return res.status(200).json({message: "Out of stock comment successfully updated"}) 
})

//purchasing verified new items update
export const updatePurchasingNewItem = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment} = req.body
  const ticket = await Ticket.findById(id)
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  }
  mail("toshiramos22@gmail.com","Approval").catch(console.error)
  try {
    if(comment.trim() !== "") {
      ticket.purchasing_approval.purchasing_comment = comment;
    }
    ticket.purchasing_approval.purchasing_approval_date = new Date();
    ticket.purchasing_approval.new_items = true;
    ticket.purchasing_oos.oos = false;
    await ticket.save();
    return res.status(200).json({message: "Ticket successfully verified"})
  } catch(error) {
    return res.status(500).json({error: error.message})
  }
})

//purchasing verified used items update
export const updatePurchasingUsedItem = asyncHandler(async(req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const ticket = await Ticket.findById(id);
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"});
  }
  mail("toshiramos22@gmail.com","Approval").catch(console.error)
  try {
    if(comment.trim() !== "") {
      ticket.purchasing_approval.purchasing_comment = comment;
    }
    ticket.purchasing_approval.purchasing_approval_date = new Date();
    ticket.purchasing_approval.used_items = true;
    ticket.purchasing_oos.oos = false;
    await ticket.save();
    return res.status(200).json({message: "Ticket successfully verified"});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
})

//update purchasing oos
export const updatePurchasingOos = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment} = req.body
  const ticket = await Ticket.findByIdAndUpdate(id,{"purchasing_oos.oos": true, "purchasing_oos.oos_comment": comment})
  mail("toshiramos22@gmail.com","Approval").catch(console.error)
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  }
  return res.status(200).json({message: "Item out of stocks"})
})

// delete ticket 
export const deleteFraud = asyncHandler(async(req, res) => {
  const {id}= req.params
  const deleteFraudTicket = await Ticket.findByIdAndDelete(id)
  if(!deleteFraudTicket) return res.status(404).json({message: "Ticket not found"})
  return res.status(200).json({message: "Ticket fraud successfully deleted"})
})

//last approval
export const updateLastApproval = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment} = req.body
  const ticket = await Ticket.findById(id)
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  }

  mail("it_support5@bernales.info","Receiving").catch(console.error)
  try {
    if(comment.trim() !== "") {
      ticket.last_approval_details.last_approval_comment = comment 
    }
    ticket.last_approval_details.last_approve_date = new Date();
    ticket.last_approval_details.last_approval = true;
    await ticket.save();

    return res.status(200).json({message: "Ticket successfully approved"})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//semi approval
export const updateSemiApproval = asyncHandler(async (req,res) => {
  const {id} = req.params
  const {comment} = req.body
  const ticket = await Ticket.findById(id)
  if(!ticket) {
    return res.status(404).json({message: "Ticket not found"})
  }
  if(ticket.request === "SIM") {
    mail("it_support5@bernales.info","Verification").catch(console.error)
  } else {
    mail("robert.ramos07281021@gmail.com","Verification").catch(console.error)
  }
  try{
    if(comment.trim() !== "") {
      ticket.semi_approved_details.semi_approved_comment = comment;
    }
    ticket.semi_approved_details.is_approve_semi = true
    ticket.semi_approved_details.semi_approved_date = new Date();
    await ticket.save()
    return res.status(200).json({message: "Ticket successfully"})
  }catch(error) {
    return res.status(500).json({error: error.message})
  }
})

//update complete
export const updateIsComplete = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment, name} = req.body
  const ticket = await Ticket.findById(id)
  if(!ticket) return res.status(404).json({message: "Ticket not found"})
  try {
    if(comment.trim() !== "") {
      ticket.complete_details.complete_comment = comment;
    }
    ticket.complete_details.complete_date = new Date();
    ticket.complete_details.receiver = name;
    ticket.complete_details.is_complete = true
    await ticket.save()
    return res.status(200).json({message: "Ticket successfully complete"})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

//fraud 
export const updateFraud = asyncHandler(async(req, res) => {
  const {id} = req.params
  const {comment,name} = req.body

  const fraudTicket = await Ticket.findById(id).populate('user')
  if(!fraudTicket){
    return res.status(404).json({message: "Ticket not found"})
  } 

    mail("it_support5@bernales.info","Fraud",res)
  try {
    fraudTicket.fraud_details.fraud_comment = comment;
    fraudTicket.fraud_details.is_fraud = true;
    fraudTicket.fraud_details.fraud_date = new Date();
    fraudTicket.fraud_details.fraud_by = name;
    await fraudTicket.save()
    return res.status(200).json({message: "Ticket is successfully fraud"})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// search
export const search = asyncHandler(async(req, res) => {
  const {status} = req.query
  const {page} = req.params
  const user = await User.findById(req.user)
  if(!user) return res.status(404).json({message: "User not found"})
  
  //  for user query
  if(user.type === "USER") {
    switch(status){

    case "reject": 
      const rejectTickets = await Ticket.find({$and: [
        {is_declined: true},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(rejectTickets)
      break;   
      
    case "aom_approval" :
      const aomApprovalUserTickets = await Ticket.find({$and: [
        {"aom_approval_details.is_approve_aom": false},
        {"is_declined": false},
        {"semi_approved_details.is_approve_semi": false},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(aomApprovalUserTickets)
      break;

    case "fraud" :
      const fraudTickets = await Ticket.find({$and: [
        {"fraud_details.is_fraud": true},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(fraudTickets)
      break; 


    case "semi_approval":
      const semiApprovalTickets = await Ticket.find({$and: [
        {"aom_approval_details.is_approve_aom": true},
        {is_declined: false},
        {"semi_approved_details.is_approve_semi": false},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(semiApprovalTickets)
      break;

    case "verify": 
      const verifiedTickets = await Ticket.find({$and: [
        {"semi_approved_details.is_approve_semi": true},
        {"verified_details.is_verified": false},
        {request: "SIM"},
        {oos: false},
        {"last_approval_details.last_approval":  false},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(verifiedTickets)
      break;
    
    case "oos":
      const oosTickets = await Ticket.find({$and: [
        {
          $or: [
          {oos:  true},
          {"purchasing_oos.oos": true}
        ]
        },
        {
          $and: [
            {"verified_details.is_verified": false},
            {"purchasing_approval.new_items": false},
            {"purchasing_approval.used_items": false},
          ]
        },
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(oosTickets)
      break;
      
    case "last_approval": 
      const lastApprovalTickets = await Ticket.find({$and: [
        {"verified_details.is_verified": true},
        {"last_approval_details.last_approval": false},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(lastApprovalTickets)
      break;
    
    case "receiving" :
      const receivingTickets = await Ticket.find({$and: [
        {"last_approval_details.last_approval": true},
        {"complete_details.is_complete": false},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(receivingTickets)
      break;

    case "complete":
      const completeTickets = await Ticket.find({$and: [
        {"complete_details.is_complete": true},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(completeTickets)
      break;

    case "purchasing":
      const purchasing = await Ticket.find({
        $and: [
          {
            $and: [
              {
              "purchasing_approval.new_items": false 
              },
              {
                "purchasing_approval.used_items": false 
              }
            ]
          },
          {"purchasing_oos.oos": false},
          {request: "HANDSET"},
          {"fraud_details.is_fraud": false},
          {"semi_approved_details.is_approve_semi": true},
          {"last_approval_details.last_approval":  false},
          {user: user._id}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
      res.status(200).json(purchasing)
    }
  }

  // for aom query
  if(user.type === "AOM") {
    
    switch(status){
      case "reject": 
        const rejectTickets = await Ticket.find({$and: [
          {is_declined: true},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        console.log("hello")
        res.status(200).json(rejectTickets)
        break; 

      case "fraud" :
        const fraudTickets = await Ticket.find({$and: [
          {"fraud_details.is_fraud": true},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(fraudTickets)
        break; 
    
      case "aom_approval":
        const aomApprovalAOMTickets = await Ticket.find({$and: [
          {"aom_approval_details.is_approve_aom": false},
          {is_declined:  false},
          {"semi_approved_details.is_approve_semi": false},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(aomApprovalAOMTickets)
        break;
      
      case "semi_approval":
        const semiApprovalTickets = await Ticket.find({$and: [
          {"aom_approval_details.is_approve_aom": true},
          {is_declined: false},
          {"semi_approved_details.is_approve_semi": false},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(semiApprovalTickets)
        break;

      case "verify": 
        const verifiedTickets = await Ticket.find({$and: [
          {"semi_approved_details.is_approve_semi": true},
          {"verified_details.is_verified": false},
          {request: "SIM"},
          {oos: false},
          {"last_approval_details.last_approval":  false},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(verifiedTickets)
        break;
      
      case "oos":
        const oosTickets = await Ticket.find({$and: [
          {
            $or: [
            {oos:  true},
            {"purchasing_oos.oos": true}
          ]
          },
          {
            $and: [
              {"verified_details.is_verified": false},
              {"purchasing_approval.new_items": false},
              {"purchasing_approval.used_items": false},
            ]
          },
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(oosTickets)
        break;
        
      case "last_approval": 
        const lastApprovalTickets = await Ticket.find({$and: [
          {"verified_details.is_verified": true},
          {"last_approval_details.last_approval": false},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(lastApprovalTickets)
        break;
      
      case "receiving" :
        const receivingTickets = await Ticket.find({$and: [
          {"last_approval_details.last_approval": true},
          {"complete_details.is_complete": false},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(receivingTickets)
        break;

      case "complete":
        const completeTickets = await Ticket.find({$and: [
          {"complete_details.is_complete": true},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(completeTickets)
        break;
      
      case "purchasing":
        const purchasing = await Ticket.find({
          $and: [
            {
              $and: [
                {
                "purchasing_approval.new_items": false 
                },
                {
                  "purchasing_approval.used_items": false 
                }
              ]
            },
            {"purchasing_oos.oos": false},
            {request: "HANDSET"},
            {"fraud_details.is_fraud": false},
            {"semi_approved_details.is_approve_semi": true},
            {"last_approval_details.last_approval":  false},
            {department: user.department},
            {branch: user.branch}
          ]
        }).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(purchasing)
    }
  }

  // for admins
  if(user.type !== "AOM" && user.type !== "USER") {
    switch(status){
      case "reject": 
        const rejectTickets = await Ticket.find({is_declined: true}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(rejectTickets)
        break; 
        

      case "aom_approval":
        const aomApprovalTicket = await Ticket.find({$and: [
          {"fraud_details.is_fraud": false},
          {"aom_approval_details.is_approve_aom" : false},
          {"is_declined": false}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(aomApprovalTicket)
        break; 


      case "fraud" :
        const fraudTickets = await Ticket.find(
          {"fraud_details.is_fraud": true}
        ).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(fraudTickets)
        break; 


      case "semi_approval":
        const semiApprovalTickets = await Ticket.find({$and: [
          {"aom_approval_details.is_approve_aom": true},
          {is_declined: false},
          {"semi_approved_details.is_approve_semi": false}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(semiApprovalTickets)
        break;

      case "verify": 
        const verifiedTickets = await Ticket.find({$and: [
          {"semi_approved_details.is_approve_semi": true},
          {"verified_details.is_verified": false},
          {oos: false},
          {request: "SIM"},
          {"last_approval_details.last_approval":  false},
          {"fraud_details.is_fraud": false}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(verifiedTickets)
        break;
      
      case "oos":
        const oosTickets = await Ticket.find({$and: [
          {
            $or: [
            {oos:  true},
            {"purchasing_oos.oos": true}
          ]
          },
          {
            $and: [
              {"verified_details.is_verified": false},
              {"purchasing_approval.new_items": false},
              {"purchasing_approval.used_items": false},
            ]
          },
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(oosTickets)
        break;
        
      case "last_approval": 
        const lastApprovalTickets = await Ticket.find({$and: [
          {"verified_details.is_verified": true},
          {"last_approval_details.last_approval": false},
          {"fraud_details.is_fraud": false}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(lastApprovalTickets)
        break;
      
      case "receiving" :
        const receivingTickets = await Ticket.find({$and: [
          {"last_approval_details.last_approval": true},
          {"complete_details.is_complete": false},
          {"fraud_details.is_fraud": false}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(receivingTickets)
        break;

      case "complete":
        const completeTickets = await Ticket.find({$and: [
          {"complete_details.is_complete": true},
          {"fraud_details.is_fraud": false}
        ]}).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(completeTickets)
        break;
      
      case "purchasing" :
        const purchasing = await Ticket.find({
          $and: [
            {
              $and: [
                {
                "purchasing_approval.new_items": false 
                },
                {
                  "purchasing_approval.used_items": false 
                }
              ]
            },
            {"purchasing_oos.oos": false},
            {request: "HANDSET"},
            {"fraud_details.is_fraud": false},
            {"semi_approved_details.is_approve_semi": true},
            {"last_approval_details.last_approval":  false},
          ]
        }).limit(10).skip((page - 1) * 10).sort({createdAt: -1})
        res.status(200).json(purchasing)
    }
  }

})

// max pages search
export const maxPagesSearch = asyncHandler(async(req, res) => {
  const {status} = req.query
  const user = await User.findById(req.user)
  if(user.type === "USER") {
    switch(status){

    case "reject": 
      const rejectTickets = await Ticket.find({$and: [
        {is_declined: true},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(rejectTickets)
      break;   
      
    case "aom_approval" :
      const aomApprovalUserTickets = await Ticket.find({$and: [
        {"aom_approval_details.is_approve_aom": false},
        {"is_declined": false},
        {"semi_approved_details.is_approve_semi": false},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(aomApprovalUserTickets)
      
      break;

    case "fraud" :
      const fraudTickets = await Ticket.find({$and: [
        {"fraud_details.is_fraud": true},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(fraudTickets)
      break; 


    case "semi_approval":
      const semiApprovalTickets = await Ticket.find({$and: [
        {"aom_approval_details.is_approve_aom": true},
        {is_declined: false},
        {"semi_approved_details.is_approve_semi": false},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(semiApprovalTickets)
      break;

    case "verify": 
      const verifiedTickets = await Ticket.find({$and: [
        {"semi_approved_details.is_approve_semi": true},
        {"verified_details.is_verified": false},
        {request: "SIM"},
        {oos: false},
        {"last_approval_details.last_approval":  false},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(verifiedTickets)
      break;
    
    case "oos":
      const oosTickets = await Ticket.find({$and: [
        {
          $or: [
          {oos:  true},
          {"purchasing_oos.oos": true}
        ]
        },
        {
          $and: [
            {"verified_details.is_verified": false},
            {"purchasing_approval.new_items": false},
            {"purchasing_approval.used_items": false},
          ]
        },
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(oosTickets)
      break;
      
    case "last_approval": 
      const lastApprovalTickets = await Ticket.find({$and: [
        {"verified_details.is_verified": true},
        {"last_approval_details.last_approval": false},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(lastApprovalTickets)
      break;
    
    case "receiving" :
      const receivingTickets = await Ticket.find({$and: [
        {"last_approval_details.last_approval": true},
        {"complete_details.is_complete": false},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(receivingTickets)
      break;

    case "complete":
      const completeTickets = await Ticket.find({$and: [
        {"complete_details.is_complete": true},
        {"fraud_details.is_fraud": false},
        {user: user._id}
      ]}).countDocuments()
      res.status(200).json(completeTickets)
      break;
      
    case "purchasing":
      const purchasing = await Ticket.find({
        $and: [
          {
            $and: [
              {
              "purchasing_apporval.new_items": false 
              },
              {
                "purchasing_apporval.used_items": false 
              }
            ]
          },
          {request: "HANDSET"},
          {"fraud_details.is_fraud": false},
          {user: user._id},
          {"semi_approved_details.is_approve_semi": true},
          {"last_approval_details.last_approval":  false},
        ]
      }).countDocuments()
      res.status(200).json(purchasing)
    }
  }


    
  // for aom query
  if(user.type === "AOM") {
    
    switch(status){
      case "reject": 
        const rejectTickets = await Ticket.find({$and: [
          {is_declined: true},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(rejectTickets)
        break; 

      case "fraud" :
        const fraudTickets = await Ticket.find({$and: [
          {"fraud_details.is_fraud": true},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(fraudTickets)
        break; 
    
      case "aom_approval":
        const aomApprovalAOMTickets = await Ticket.find({$and: [
          {"aom_approval_details.is_approve_aom": false},
          {is_declined:  false},
          {"semi_approved_details.is_approve_semi": false},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(aomApprovalAOMTickets)
        break;
      
      case "semi_approval":
        const semiApprovalTickets = await Ticket.find({$and: [
          {"aom_approval_details.is_approve_aom": true},
          {is_declined: false},
          {"semi_approved_details.is_approve_semi": false},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(semiApprovalTickets)
        break;

      case "verify": 
        const verifiedTickets = await Ticket.find({$and: [
          {"semi_approved_details.is_approve_semi": true},
          {"verified_details.is_verified": false},
          {oos: false},
          {"last_approval_details.last_approval":  false},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch},
          {request: "SIM"}
        ]}).countDocuments()
        res.status(200).json(verifiedTickets)
        break;
      
      case "oos":
        const oosTickets = await Ticket.find({$and: [
          {
            $or: [
              {oos:  true},
              {"purchasing_oos.oos": true}
            ]
          },
          {
            $and: [
              {"verified_details.is_verified": false},
              {"purchasing_approval.new_items": false},
              {"purchasing_approval.used_items": false},
            ]
          },
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(oosTickets)
        break;
        
      case "last_approval": 
        const lastApprovalTickets = await Ticket.find({$and: [
          {"verified_details.is_verified": true},
          {"last_approval_details.last_approval": false},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(lastApprovalTickets)
        break;
      
      case "receiving" :
        const receivingTickets = await Ticket.find({$and: [
          {"last_approval_details.last_approval": true},
          {"complete_details.is_complete": false},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(receivingTickets)
        break;

      case "complete":
        const completeTickets = await Ticket.find({$and: [
          {"complete_details.is_complete": true},
          {"fraud_details.is_fraud": false},
          {department: user.department},
          {branch: user.branch}
        ]}).countDocuments()
        res.status(200).json(completeTickets)
        break;

      case "purchasing": 
        const purchasing = await Ticket.find({$and: [
          {
            $and: [
              {
              "purchasing_apporval.new_items": false 
              },
              {
                "purchasing_apporval.used_items": false 
              }
            ]
          },
          {request: "HANDSET"},
          {"fraud_details.is_fraud": false},
          {user: user._id},
          {"semi_approved_details.is_approve_semi": true},
          {"last_approval_details.last_approval":  false},
        ]}).countDocuments()
        res.status(200).json(purchasing)
    }
  }

  // for admins
  if(user.type !== "AOM" && user.type !== "USER") {
    switch(status){
      case "reject": 
        const rejectTickets = await Ticket.find({is_declined: true}).countDocuments()
        res.status(200).json(rejectTickets)
        break; 
        

      case "aom_approval":
        const aomApprovalTicket = await Ticket.find({$and: [
          {"fraud_details.is_fraud": false},
          {"aom_approval_details.is_approve_aom" : false},
          {"is_declined": false}
        ]}).countDocuments()
        res.status(200).json(aomApprovalTicket)
        break; 


      case "fraud" :
        const fraudTickets = await Ticket.find(
          {"fraud_details.is_fraud": true}
        ).countDocuments()
        res.status(200).json(fraudTickets)
        break; 


      case "semi_approval":
        const semiApprovalTickets = await Ticket.find({$and: [
          {"aom_approval_details.is_approve_aom": true},
          {is_declined: false},
          {"semi_approved_details.is_approve_semi": false}
        ]}).countDocuments()
        res.status(200).json(semiApprovalTickets)
        break;

      case "verify": 
        const verifiedTickets = await Ticket.find({$and: [
          {"semi_approved_details.is_approve_semi": true},
          {"verified_details.is_verified": false},
          {oos: false},
          {request: "SIM"},
          {"last_approval_details.last_approval":  false},
          {"fraud_details.is_fraud": false}
        ]}).countDocuments()
        res.status(200).json(verifiedTickets)
        break;
      
      case "oos":
        const oosTickets = await Ticket.find({$and: [
          {
            $and: [
              {oos:  true},
              {"purchasing_oos.oos": true}
            ]
          },
          {
            $and: [
              {"verified_details.is_verified": false},
              {"purchasing_approval.new_items": false},
              {"purchasing_approval.used_items": false},
            ]
          },
        ]}).countDocuments()
        res.status(200).json(oosTickets)
        break;
        
      case "last_approval": 
        const lastApprovalTickets = await Ticket.find({$and: [
          {"verified_details.is_verified": true},
          {"last_approval_details.last_approval": false},
          {"fraud_details.is_fraud": false}
        ]}).countDocuments()
        res.status(200).json(lastApprovalTickets)
        break;
      
      case "receiving":
        const receivingTickets = await Ticket.find({$and: [
          {"last_approval_details.last_approval": true},
          {"complete_details.is_complete": false},
          {"fraud_details.is_fraud": false}
        ]}).countDocuments()
        res.status(200).json(receivingTickets)
        break;

      case "complete":
        const completeTickets = await Ticket.find({$and: [
          {"complete_details.is_complete": true},
          {"fraud_details.is_fraud": false}
        ]}).countDocuments()
        res.status(200).json(completeTickets)
        break;

      case "purchasing":
        const purchasingTickets = await Ticket.find({$and: [
          {
            $and: [
              {
              "purchasing_apporval.new_items": false 
              },
              {
                "purchasing_apporval.used_items": false 
              }
            ]
          },
          {"purchasing_oos.oos": false},
          {request: "HANDSET"},
          {"fraud_details.is_fraud": false},
          {"semi_approved_details.is_approve_semi": true},
          {"last_approval_details.last_approval":  false},
        ]}).countDocuments()
        res.status(200).json(purchasingTickets)

    }
  }


})

//reports
export const reports = asyncHandler(async(req,res) => {
  const {branch, dept, from, to} = req.query;
  const {page} = req.params

  let fromDate = `${new Date(from).getMonth() + 1}/${
    new Date(from).getDate() + 1
  }/${new Date(from).getFullYear()}`;

  let toDate = `${new Date(to).getMonth() + 1}/${
    new Date(to).getDate() + 1
  }/${new Date(to).getFullYear()}`;

  const arraySearch = [{
    "complete_details.is_complete": true
  }]

  if(branch.trim() !== "") {
    arraySearch.push({branch: branch})
  }
  if(dept.trim() !== "") {
    arraySearch.push({department: dept})
  }
  if(from && to) {
    arraySearch.push({createdAt: {$lte: new Date(toDate), $gte: new Date(from)}})
  }
  if(from && !to) {
    arraySearch.push({createdAt: {$gte: new Date(from), $lte: new Date(fromDate)}})
  }
  if(!from && to) {
    arraySearch.push({createdAt: {$gte: new Date(to), $lte: new Date(toDate)}})
  }

  try {
    const tickets = await Ticket.find({$and: arraySearch}).limit(17).skip((page - 1) * 17)
    const ticketTotalPage = await Ticket.find({$and: arraySearch}).countDocuments()
    const totalPage = Math.ceil(ticketTotalPage/17)
    const allTicketsReports = await Ticket.find({$and: arraySearch})


    return res.status(200).json({tickets,totalPage,allTicketsReports})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})





