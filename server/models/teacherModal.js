const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const TeacherSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    cin: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fName: { type: String, required: false },
    lName: { type: String, required: false },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    access: { type: Object, required: false, default: "teacher" },
    status: {
        type: String,
        default: "active",
    },
    files: {
        type: String,
    },
    specialites: [{
        type: Schema.Types.ObjectId,
        ref: "specialty",
        autopopulate: true,
    }],
});

//below line will automatically generate createdAt & updatedAt fields
TeacherSchema.set("timestamps", true);
TeacherSchema.methods.setPassword = function (password) {
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_ROUNDS));
    this.password = hashedPassword
};



TeacherSchema.plugin(require("mongoose-autopopulate"));
module.exports = TeacherSchema;