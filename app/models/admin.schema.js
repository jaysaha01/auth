const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    fullname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVarified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const admin = mongoose.model('admin', adminSchema);

module.exports = admin
