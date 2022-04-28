const express = require("express");
const router = express.Router();
const CRUD = require("@controllers/UtilitiesControlles")
const upload = require("@middlewares/multer")
const { SujetModal } = require('@models')

router.put("/", upload.array('files', 1),
    async (req, res, next) => {
        const code = await SujetModal.countDocuments({});
        req.body.code = code + 1
        next();
    },
    CRUD.create,
    CRUD.resultHundler)
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
    "/filter",
    CRUD.filter,
    CRUD.resultHundler
);


module.exports = router;