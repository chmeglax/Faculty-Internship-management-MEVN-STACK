const mongoose = require("mongoose");

const { Schema } = mongoose;
const SessionSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    code: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    type: {
        type: String,
        enum: ['PFA', 'PFE']
    },
});

//below line will automatically generate createdAt & updatedAt fields
SessionSchema.set("timestamps", true);
module.exports = SessionSchema;