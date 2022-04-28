const express = require("express");
const router = express.Router();
const Joi = require("joi");
const CRUD = require("@controllers/UtilitiesControlles")
const soutenanceController = require("@controllers/soutenanceController")
const upload = require("@middlewares/multer")

router.put("/", soutenanceController.create)
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