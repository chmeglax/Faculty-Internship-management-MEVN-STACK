const mongoose = require("mongoose");

const { Schema } = mongoose;
const OrganismeSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    adresse: { type: String },
    phone: { type: String },
    email: { type: String },
    secteur: { type: String },
});

//below line will automatically generate createdAt & updatedAt fields
OrganismeSchema.set("timestamps", true);
module.exports = OrganismeSchema;