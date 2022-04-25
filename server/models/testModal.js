const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestModal = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  fullName:String,
  adress:String,
  files: [{
    filename: String,
    path: String,
  }],
});

//below line will automatically generate createdAt & updatedAt fields
TestModal.set("timestamps", true);

module.exports = TestModal;