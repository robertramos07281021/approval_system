import { Router } from "express"
const router = Router()
import { auth } from "../../../middleware/auth.js"
import { allDept, deleteDept, newDepartment, updateDept } from "../controllers/departmentController.js"
import { validateNewDepartment } from "../../../middleware/modelValidation.js"

router.post('/new-department',auth, validateNewDepartment, newDepartment),
router.put('/update-department/:id',auth, updateDept)
router.delete('/delete-department/:id',auth,deleteDept)
router.get('/all-departments',auth, allDept)

export {router as DepartmentRouter}