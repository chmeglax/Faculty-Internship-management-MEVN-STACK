const express = require("express");
const router = express.Router();
const Joi = require("joi");
const CRUD = require("@controllers/UtilitiesControlles")
const teacherController = require("@controllers/teacherController")
const upload = require("@middlewares/multer")

router.post('/login', teacherController.login)
router.put("/", upload.array('files', 1), teacherController.createUser)
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