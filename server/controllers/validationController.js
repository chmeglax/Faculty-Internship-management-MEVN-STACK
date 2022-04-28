const { ValidationModal, SujetModal } = require('@models')
const Joi = require("joi");

const validator = {
    //sujet: Joi.string().required(),
    teachers: Joi.array(),
}
module.exports = {
    updateOrCreate: async (req, res, next) => {
        try {
            const idSujet = req.params.idSujet
            console.log(idSujet)
            const { teachers } = await Joi.object(validator).validateAsync(req.body)
            console.log(teachers)

            const options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            };
            let errors = 0
            const oldValidation = await ValidationModal.find({ sujet: idSujet }, 'teacher', function (err, docs) {
                docs.forEach((elem) => {
                    if (!teachers.includes(elem.teacher))
                        ValidationModal.deleteOne({ _id: elem._id }).exec()
                })

            });
            teachers.forEach((elem) => {

                ValidationModal.findOneAndUpdate({ teacher: elem, sujet: idSujet }, { teacher: elem, sujet: idSujet }, options, (error, result) => {
                    if (error) {
                        errors = errors + 1
                        return;
                    }
                })
            })
            if (!errors)
                res.json({ message: "affectation effectuer !" })
            else res.json({ message: "Affectation non effectué !" })


        }
        catch (e) {
            console.log(e)
            res.status(422).json({
                message: e.stack
            })
        }


    },

    submitValidation: async (req, res, next) => {
        try {
            const idValidation = req.params.idValidation
            const updateData = req.body

            let errors = 0
            ValidationModal.findOneAndUpdate({ _id: idValidation },
                updateData, async function (err, doc) {
                    if (err) {
                        console.log(err)
                        res.status(409).json(err)
                    }
                    else {
                        const count = await ValidationModal.countDocuments({ sujet: doc.sujet, validated: true });
                        if (count > 1)
                            SujetModal.updateOne({ _id: doc.sujet }, { validated: true, locked: true }).exec()
                        else SujetModal.updateOne({ _id: doc.sujet }, { validated: false, locked: false }).exec()
                        res.json({ message: "validation mis a jour!" })
                    }
                });
        }
        catch (e) {
            console.log(e)
            res.status(422).json({
                message: e.stack
            })
        }


    },
}






