const mongoose = require("mongoose");

const { Schema } = mongoose;
const SujetSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    code: { type: String },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    organisme: {
        type: String, required: true
    },
    encadrantS: {
        name: { type: String, required: false },
        job: { type: String, required: false },
    },
    type: {
        type: String,
        enum: ['PFA', 'PFE']
    },
    validated: {
        type: Boolean,
        default: false,
    },
    specialites: [{
        type: Schema.Types.ObjectId,
        ref: "specialty",
        autopopulate: true,
    }],
    files: {
        type: String,
    },
    binome: {
        type: Boolean,
        default: false,
    },
    //if sujet is validated it becomes locked
    locked: {
        type: Boolean,
        default: false,
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: "student",
        autopopulate: true,
    }],
});

//below line will automatically generate createdAt & updatedAt fields
SujetSchema.set("timestamps", true);

/*
SujetSchema.pre('save', function (next) {
    var doc = this;
    console.log(this)
    SujetModal.findByIdAndUpdate({ _id: doc._id }, { $inc: { code: 1 } }, function (error, counter) {
        if (error)
            return next(error);
        doc.code = counter.code;
        next();
    });
});
*/

SujetSchema.plugin(require("mongoose-autopopulate"));
module.exports = SujetSchema;