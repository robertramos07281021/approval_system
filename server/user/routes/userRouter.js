import { Router } from "express";
import { 
  allUser, 
  changePass, 
  findUser, 
  itUpdateIsOnline, 
  login, 
  logout, 
  register, 
  updateAccount, 
  updateIsOnline 
} from "../controllers/userControllers.js";
import { auth } from "../../../middleware/auth.js";
import { validateChangePassword, validateLogin, validateUpdateUser, validateUser } from "../../../middleware/modelValidation.js";

const router = Router();

router.post(`/create`, auth, validateUser, register)
router.post('/login', validateLogin, login)
router.post('/logout/:id', logout)
router.put("/update-account/:id", auth, validateUpdateUser, updateAccount)
router.put('/update-isonline/:id', auth, updateIsOnline)
router.get('/find-user/:id', auth, findUser)
router.get('/find-alluser', auth, allUser)
router.put("/change-password/:id", auth, validateChangePassword, changePass)
router.put('/update-it-is-online',itUpdateIsOnline)

export {router as UserRouter};