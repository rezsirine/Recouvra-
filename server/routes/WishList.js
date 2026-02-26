const express = require("express")
const { getWishList,addToWishList,deleteFromWishList,getWishListOfOneUser,deleteThisUserWishList} = require("../controller/wishlist.controller")
const router = express.Router()

router.get("/getAll",getWishList)
router.post("/add",addToWishList)
router.delete("/delete/:productId/:userId",deleteFromWishList)
router.delete("/deleteAll/:id",deleteThisUserWishList)
router.get("/getOne/:id",getWishListOfOneUser)

module.exports = router;