const mongoose = require("mongoose");

const { Schema } = mongoose;
const SoutenanceSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    code: { type: String },
    //Pour chaque PFE qui sera soutenu dans cette session, on fixe la date, l’heure et la salle et on affecte un jury qui est composé d’un président et d’un rapporteur en plus de l’enseignant encadrant et l’encadrant dans l’entreprise d’accueil
    timestamp: { type: Date },
    salle: { type: String, required: false },
    jury: {
        rapporteur: {
            type: Schema.Types.ObjectId,
            ref: "teacher",
            autopopulate: true,
        },
        president: {
            type: Schema.Types.ObjectId,
            ref: "teacher",
            autopopulate: true,
        },
        encadrant: {
            type: Schema.Types.ObjectId,
            ref: "teacher",
            autopopulate: true,
        },
    },
    status: {
        type: String,
        default: "active",
    },
    session: {
        type: Schema.Types.ObjectId,
        ref: "session",
        autopopulate: true,
    },
});

//below line will automatically generate createdAt & updatedAt fields
SoutenanceSchema.set("timestamps", true);




SoutenanceSchema.plugin(require("mongoose-autopopulate"));
module.exports = SoutenanceSchema;