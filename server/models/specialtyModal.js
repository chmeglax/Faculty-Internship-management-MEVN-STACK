const mongoose = require("mongoose");

const { Schema } = mongoose;
const SpecialtySchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
});

//below line will automatically generate createdAt & updatedAt fields
SpecialtySchema.set("timestamps", true);
SpecialtySchema.plugin(require("mongoose-autopopulate"));
module.exports = SpecialtySchema;