import Joi from "joi";
// for users ===================================================================
//for new accounts
export const UserSchemaValidation = Joi.object({
  email: Joi.string()
  .required()
  .email({minDomainSegments: 2, tlds: {allow: true}}),
  password: Joi.string()
  .required()
  .regex(/^[A-Za-z0-9]/),
  confirmPass: Joi.ref("password"),
  name: Joi.string()
  .required(),
  department: Joi.string()
  .required(),
  type: Joi.string()
  .required()
  .valid('USER','AOM','SEMI-APPROVER','ADMIN','APPROVER','PURCHASING'),
  branch: Joi.string()
  .required(),
  username: Joi.string().required().regex(/^[A-Za-z0-9]/)
})

//for login account
export const LoginSchemaValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

//for update user
export const UpdateUserSchemaValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email({minDomainSegments: 2, tlds: {allow: true}}),
})

//change password
export const ChangePasswordValidation = Joi.object({
  password: Joi.string()
  .required()
  .regex(/^[A-Za-z0-9]/),
  confirmPass: Joi.ref("password"),
})

// for departments ===========================================================
export const DepartmentSchemaValidation = Joi.object({
  name: Joi.string().required()
})


//for branches
export const BranchSchemaValidation = Joi.object({
  name: Joi.string().required()
})

export const TicketSchemaValidation = Joi.object({
  employee_name: Joi.string().required(),
  position: Joi.string().required(),
  request: Joi.string().required().valid("SIM","HANDSET"),
  qty: Joi.number().min(0).required(),
  purpose: Joi.string().required(),
  department: Joi.string().required()
})


