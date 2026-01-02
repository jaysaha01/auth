const statusCode = require("../config/status")
const admin = require("../models/admin.schema");

class blogController {
    async viewhome(req, res) {
        try {
            const user = await admin.findOne({_id : req.user._id });
            return res.status(statusCode.success).json({
                message: "Profile fetch Successfully!",
                data: user,
            });
        } catch (err) {
            res.send("Error")
        }
    }
}

module.exports = new blogController