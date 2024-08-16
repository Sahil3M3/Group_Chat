const {Router}=require('express');
const router=Router();

const groupController=require('../controller/group');
const auth=require('../middleware/auth')

router.post('/',auth,groupController.createGroup);
router.post('/:groupId/join',auth,groupController.JoinGroup);
router.get('/',auth,groupController.getMember);
router.get('/:groupId/messages',auth,groupController.getAllMessage);
router.post('/:groupId/messages',auth,groupController.newMassage);
router.post('/join',auth,groupController.joinGroup2);



module.exports=router
