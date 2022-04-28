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
            let errors = 0
            const toValidate = await ValidationModal.find({ teacher: idTeacher }).distinct('sujet');
            console.log(toValidate)
            SujetModal.find({ _id: { $in: toValidate } }, function (err, docs) {
                if (!err)
                    res.json(docs)
                else res.status(408).json({ error: err })
            });
        }
        catch (e) {
            console.log(e)
            res.status(422).json({
                message: e.stack
            })
        }
    }
}






