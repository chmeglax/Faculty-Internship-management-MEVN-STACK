const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const StudentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true },
  fName: { type: String, required: false },
  lName: { type: String, required: false },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  access: { type: Object, required: false },
  status: {
    type: String,
    default: "active",
  },
  files: {
    type: String,
  },
});

//below line will automatically generate createdAt & updatedAt fields
StudentSchema.set("timestamps", true);
StudentSchema.methods.setPassword = function (password) {
  const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_ROUNDS));
  this.password = hashedPassword
};



StudentSchema.plugin(require("mongoose-autopopulate"));
module.exports = StudentSchema;