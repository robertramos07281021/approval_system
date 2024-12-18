import Branch from "../model/Branch.js";
import Department from "../model/Department.js";
import { 
  BranchSchemaValidation,
  ChangePasswordValidation, 
  DepartmentSchemaValidation, 
  LoginSchemaValidation, 
  TicketSchemaValidation, 
  UpdateUserSchemaValidation, 
  UserSchemaValidation 
} from "./joi.js"

//validate new user
export const validateUser = async(req, res, next) => {
  const {error} = UserSchemaValidation.validate(req.body);

  const dept = await Department.find({name: req.body.department})
  if(!dept) return res.status(404).json({message: "Danger"})

  
  const branch = await Branch.find({name: req.body.branch})
  if(!branch) return res.status(404).json({message: "Danger"})

  if(error) {
    return res.status(400).json({message: "Danger"});
  } else {
    next();
  }
}

//validate login
export const validateLogin = (req, res, next) => {
  const {error} = LoginSchemaValidation.validate(req.body);
  if(error) {
    return res.status(400).json({message: "Danger"})
  } else {
    next();
  }
}

//validate update user
export const validateUpdateUser = (req, res, next) => {
  const {error} = UpdateUserSchemaValidation.validate(req.body);
  if(error) {
    return res.status(400).json({message: "Danger"})
  } else {
    next()
  }
}

//validate change password
export const validateChangePassword = (req, res, next) => {
  const {error} = ChangePasswordValidation.validate(req.body);
  if(error) {
    return res.status(400).json({message: "Danger"})
  } else {
    next()
  }
}

//validate new department
export const validateNewDepartment = (req, res, next) => {
  const {error} = DepartmentSchemaValidation.validate(req.body);
  if(error) {
    return res.status(400).json({message: "Danger"})
  } else {
    next()
  }
}

//validate new branch
export const validateNewBranch = (req,res ,next) => {
  const {error} = BranchSchemaValidation.validate(req.body)
  if(error){
    return res.status(400).json({message: "Danger"})
  } else {
    next()
  }
}

export const validateTicketRequest = (req, res, next) => {
  const {error} = TicketSchemaValidation.validate(req.body)
  if(error) {
    return res.status(400).json({message: "Danger"})
  } else {
    next()
  }
}
