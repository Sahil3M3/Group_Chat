const {Router}=require('express')
const router=Router();
const auth=require('../middleware/auth');
const chatController=require('../controller/chat')


router.post('/',auth,chatController.newMassage);
router.get('/:afterId',auth,chatController.getAllMessage);


module.exports=router;