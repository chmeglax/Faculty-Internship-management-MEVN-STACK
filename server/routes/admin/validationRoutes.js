const express = require("express");
const router = express.Router();
const Joi = require("joi");
const CRUD = require("@controllers/UtilitiesControlles")
const validationController = require("@controllers/validationController")
/*{
            sujet: Joi.string().required(),
            validations: Joi.array(),
        } */
router.patch("/:idSujet", validationController.updateOrCreate)
router.delete(
    "/:id",

    (req, res, next) => {
        req.body.option = "one";

        next();
    },
    CRUD.delete,
    CRUD.resultHundler
);

router.post(
    "/filter",
    CRUD.filter,
    CRUD.resultHundler
);


module.exports = router;