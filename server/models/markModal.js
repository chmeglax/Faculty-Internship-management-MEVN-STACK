const mongoose = require("mongoose");

const { Schema } = mongoose;
const MarkSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: "teacher",
        autopopulate: true,
    },
    note: {
        type: Number,
    },
    comment: {
        type: String,
    },
    soutenance: {
        type: Schema.Types.ObjectId,
        ref: "soutenance",
        autopopulate: true,
    },

});

//below line will automatically generate createdAt & updatedAt fields
MarkSchema.set("timestamps", true);




MarkSchema.plugin(require("mongoose-autopopulate"));
module.exports = MarkSchema;