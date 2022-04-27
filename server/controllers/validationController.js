const { ValidationModal } = require('@models')
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

}






