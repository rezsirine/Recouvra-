const {User , Product , WishList} = require("../model/populate")

module.exports = {
    getWishList : async (req , res)=>{

       try {
        const all = await WishList.findAll()
        res.status(200).json(all)
        
       } catch (error) {
        throw Error(error)
       }
    },
    addToWishList: async (req,res)=>{
        try {
            const toAdd = await WishList.create(req.body)
            res.status(200).json(toAdd)

        } catch (error) {
            throw Error(error)
        }
    },

    deleteFromWishList: async (req,res)=>{
        try {
            const deleted = await destroy({where:{productId:req.params.productId,  userId:req.params.userId}})
            res.status(200).json(deleted)

        } catch (error) {

            throw Error(error)
        }
    },
    getWishListOfOneUser: async (req, res) => {
  try {
    const userWishlist = await User.findOne({
      where: { id: req.params.id },
      
        
          include: ["products"] 
       
     
    });
    console.log(userWishlist);

    if (!userWishlist) {
      return res.status(404).json({ message: 'User not found' });
    }
    const wishLists=[...userWishlist.products]
   
    res.status(200).json(wishLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

    deleteThisUserWishList: async (req,res)=>{
        try {
            const bayBay = await WishList.destroy({where:{userId:req.params.userId}})
            res.status(200).json(bayBay)
        } catch (error) {
            throw Error(error)
        }
    }
}