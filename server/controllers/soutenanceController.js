const { SoutenanceModal, SujetModal } = require('@models')
const Joi = require("joi");

const validator = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    cin: Joi.string().required(),
    fName: Joi.string(),
    lName: Joi.string(),
    phone: Joi.string(),
    specialites: Joi.array()
}
module.exports = {

    create: async (req, res, next) => {
        try {
            const data = req.body
            console.log(data)
            const count = await SoutenanceModal.countDocuments({
                timestamp: data.timestamp,
                $or: [{ "jury.rapporteur": data.jury.rapporteur },
                { "jury.president": data.jury.president },
                { "jury.encadrant": data.jury.encadrant }]
            });

            if (count > 0) {
                res.status(409).json({ message: "l'un des jury n'est pas disponible a cette horaire" });
            } else {
                const newSoutenance = new SoutenanceModal(data);
                newSoutenance.save().then((soutenance, err) => {
                    if (err) return res.status(422).json(err);
                    SujetModal.updateOne({ _id: data.sujet }, { soutenance: true }).exec()
                    return res.json(soutenance);
                });
            }

        }
        catch (e) {
            console.log(e)
            res.status(422).json({
                message: e.stack
            })
        }
    }
}






