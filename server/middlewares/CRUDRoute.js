const express = require("express");
const app = express();
const CRUD = require("@controllers/UtilitiesControlles")
const upload = require("@middlewares/multer")


/*
this file should not be modified unless you want to add
a global crud fonctionality
*/
app.put("/", upload.array('files', 1),
    CRUD.create,
    CRUD.resultHundler,
);
app.delete(
    "/:id",

    (req, res, next) => {
        req.body.option = "one";

        next();
    },
    CRUD.delete,
    CRUD.resultHundler
);

app.delete(
    "/",

    (req, res, next) => {
        req.body.option = "many";
        next();
    },
    CRUD.delete,
    CRUD.resultHundler
);

app.patch(
    "/:id",
    upload.array('files', 5),
    (req, res, next) => {
        req.body.option = "one";
        next();
    },
    CRUD.update,
    CRUD.resultHundler
);

app.patch(
    "/",
    (req, res, next) => {
        req.body.option = "many";
        next();
    },
    CRUD.update,
    CRUD.resultHundler
);

app.post(
    "/filter",
    CRUD.filter,
    CRUD.resultHundler
);
module.exports = app

