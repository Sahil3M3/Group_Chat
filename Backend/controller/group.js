const groupService = require('../service/group');

module.exports.createGroup = async (req, res) => {
    const result = await groupService.newGroup(req);
    return res.status(result.status).json({ message: result.message, group: result.group, error: result.error });
};

module.exports.JoinGroup = async (req, res) => {
    const result = await groupService.JoinGroup(req);
    return res.status(result.status).json({ message: result.message, membership: result.membership, error: result.error });
};

module.exports.getGroup = async (req, res) => {
    const result = await groupService.getGroups(req);  
    return res.status(200).json(result);
};

module.exports.getAllMessage = async (req, res) => {
    try {
        const messages = await groupService.getMessage(req);
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

module.exports.newMassage = async (req, res) => {
    const result = await groupService.createMessage(req);
    return res.status(result.status).json({ message: result.message, error: result.error });
};

module.exports.joinGroup2 = async (req, res) => {
    const result = await groupService.joinGroup2(req);
    return res.status(result.status).json({ message: result.message, error: result.error });
};

module.exports.updateAdminStatus = async (req, res) => {
   
    
    const result = await groupService.updateAdminStatus(req);
    return res.status(result.status).json({ message: result.message, error: result.error });
};

module.exports.removeUserFromGroup = async (req, res) => {
    const result = await groupService.removeUserFromGroup(req);
    return res.status(result.status).json({ message: result.message, error: result.error });
};

module.exports.getMemberByEmail=async (req,res,next) => {
    const result = await groupService.MemberByEmail(req);
    return res.status(result.status).json({ message: result.message, error: result.error });
    
}