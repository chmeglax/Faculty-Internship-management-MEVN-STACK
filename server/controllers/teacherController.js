const jwt = require('jsonwebtoken');
const passport = require("passport");
const { TeacherModal, ValidationModal, SujetModal } = require('@models')
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
    login: (req, res, next) => {
        passport.authenticate("local", { session: false }, (error, user) => {
            console.log("executing callback auth * from authenticate for local strategy ");

            //if there was an error in the verify callback related to the user data query 
            if (error || !user) {
                res.status(408).json({
                    message: "Email ou Mot de passe non valide !",
                    error: error,
                })
            } else {
                console.log("*** Token generation begins ***** ");
                const payload = {
                    sub: user.id,
                    email: user.email,
                    fName: user.fName,
                    lName: user.lName,
                    files: user.files,
                    phone: user.phone,
                    section: user.section,
                    student: false
                };
                const info = JSON.parse(JSON.stringify(user))
                delete info.password
                /* we only inficate the payload since the header is already created by the jsonwebtoken lib internally
                for the calculation of the signature and thus obtain the token */
                const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM, expiresIn: process.env.JWT_EXPIRES_IN });
                res.json({ info: info, token: token, type: user.type });
            }

        })(req, res);
    },
    createUser: async (req, res, next) => {
        try {
            if (req.files && req.files.length) {
                req.body.files = req.files[0].path
            }

            const result = await Joi.object(validator).validateAsync(req.body)
            console.log(result)

            TeacherModal.find({ email: req.body.email })
                .exec()
                .then((user) => {
                    if (user.length >= 1) {
                        // checking existence of the user
                        return res.status(409).json({
                            message: "email exists",
                        });
                    } else {

                        const newUser = new TeacherModal(result);

                        newUser.setPassword(req.body.password);
                        newUser.save().then((user) => {
                            return res.json(user);
                        });
                    }
                })
        }
        catch (e) {
            console.log(e)
            res.status(422).json({
                message: e.stack
            })
        }


    },

    getAffectedSujet: async (req, res, next) => {
        try {
            const idTeacher = req.params.id
            console.log(idTeacher)
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






