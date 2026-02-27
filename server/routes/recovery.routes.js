const express = require('express')
const { 
    getAllActions, 
    getActionById, 
    createAction, 
    updateAction, 
    deleteAction,
    getMyActions,
    getUpcomingActions,
    getActionStats
} = require('../controller/recovery.controller')
const router = express.Router()

router.get("/getAll", getAllActions)
router.get("/my-actions", getMyActions)
router.get("/upcoming", getUpcomingActions)
router.get("/stats", getActionStats)
router.get("/get/:id", getActionById)
router.post("/create", createAction)
router.put("/update/:id", updateAction)
router.delete("/delete/:id", deleteAction)


module.exports = router