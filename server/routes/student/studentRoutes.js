const express = require("express");
const router = express.Router();
const Joi = require("joi");
const CRUD = require("@controllers/UtilitiesControlles")
const studentController = require("@controllers/studentController")
const upload = require("@middlewares/multer")

router.post('/login', studentController.login)
router.put("/", upload.array('files', 1), studentController.createUser)
router.delete(
    "/:id",

    (req, res, next) => {
        req.body.option = "one";

        next();
    },
    CRUD.delete,
    CRUD.resultHundler
);

router.patch(
    "/:id",
    upload.array('files', 1),
    (req, res, next) => {
        req.body.option = "one";
        next();
    },
    CRUD.update,
    CRUD.resultHundler
);
router.post(
    "/",
    CRUD.filter,
    CRUD.resultHundler
);


module.exports = router;