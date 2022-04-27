const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const ValidationSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    sujet: {
        type: Schema.Types.ObjectId,
        ref: "sujet",
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "teacher",
    },
    validated: {
        type: Boolean,
        default: false,
    },
    comment: {
        type: String
    }
});

//below line will automatically generate createdAt & updatedAt fields
ValidationSchema.set("timestamps", true);
ValidationSchema.methods.setPassword = function (password) {
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_ROUNDS));
    this.password = hashedPassword
};



ValidationSchema.plugin(require("mongoose-autopopulate"));
module.exports = ValidationSchema;