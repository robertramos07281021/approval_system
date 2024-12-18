import { Router } from "express";
import { 
  addRequest, 
  allTickets, 
  allTicketsWithPage, 
  aomTIcketApproval, 
  aomTickets, 
  aomTicketsWithPage, 
  deleteFraud, 
  findUserTickets, 
  maxPagesSearch, 
  reports, 
  search, 
  ticketDeclined, 
  updateFraud, 
  updateIsComplete, 
  updateLastApproval, 
  updateOos, 
  updateOosComment, 
  updatePurchasingNewItem, 
  updatePurchasingOos, 
  updatePurchasingUsedItem, 
  updateSemiApproval, 
  updateTicketOpen, 
  updateVerify, 
  userDeleteTicket, 
  userTicketReattempt, 
  userTickets, 
  userTicketUpdate 
} from "../controllers/ticketController.js";
import { auth } from "../../../middleware/auth.js";
import { validateTicketRequest } from "../../../middleware/modelValidation.js";
const router = Router()
// tickets
// validateTicketRequest
router.get("/user-tickets/:page", auth, findUserTickets);
router.get("/user-tickets", auth, userTickets);
router.get("/aom-tickets", auth, aomTickets)
router.get("/aom-tickets/:page", auth, aomTicketsWithPage)
router.get("/all-tickets", auth, allTickets)
router.get('/all-tickets/:page', auth, allTicketsWithPage)
router.get('/ticket-search/:page', auth, search)
router.get('/ticket-maxpage-search', auth, maxPagesSearch)
router.get('/ticket-report/:page', auth, reports)

router.put('/ticket-purchasing-oos/:id',auth, updatePurchasingOos)
router.put('/ticket-purchasing-new-item/:id',auth, updatePurchasingNewItem)
router.put('/ticket-purchasing-used-item/:id',auth, updatePurchasingUsedItem)

router.put("/ticket-declined/:id", auth, ticketDeclined)
router.post("/new_request", auth, validateTicketRequest, addRequest);
router.put("/user-ticket-reattempt/:id", auth, userTicketReattempt)
router.put('/ticket-verified/:id', auth, updateVerify)
router.put("/aom-ticket-approval/:id", auth, aomTIcketApproval)
router.put('/ticket-last-approval/:id', auth, updateLastApproval)
router.put('/ticket-completed/:id', auth, updateIsComplete)
router.put('/ticket-open/:id', auth, updateTicketOpen);
router.put('/user-ticket-update/:id', auth, userTicketUpdate)
router.delete("/user-ticket-delete/:id", auth, userDeleteTicket)
router.put("/ticket-oos/:id", auth, updateOos)
router.put('/ticket-oos-comment/:id', auth, updateOosComment)
router.put("/ticket-fraud/:id", auth, updateFraud)
router.delete("/ticket-fraud-delete/:id", auth, deleteFraud)
router.put('/ticket-semi-approval/:id',auth, updateSemiApproval)





export {router as TicketRoutes}