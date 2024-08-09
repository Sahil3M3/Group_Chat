const {Router}=require('express')
const router=Router();


const userController=require('../controller/user')

router.post('/signup',userController.userSignup);
router.post('/login',userController.userLogin)

module.exports=router;