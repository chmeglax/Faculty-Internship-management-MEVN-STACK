const express = require("express");
const app = express();
const Joi = require("joi");
const CRUDRoutes = require("@middlewares/CRUDRoute")
const studentRoutes = require("./studentRoutes")
const passport = require("passport");
app.use("/",
    (req, res, next) => {
        res.locals.modelName = "StudentModal"
        next()
    },
    studentRoutes)
app.use("/sujet",
    (req, res, next) => {
        res.locals.modelName = "SujetModal";
        res.locals.validator = {
            name: Joi.string().required(),
            desc: Joi.string(),
            encadrantS: Joi.object(),
            specialites: Joi.array(),
            files: Joi.any(),
            binome: Joi.boolean(),
            //if sujet is validated it becomes locked

            students: Joi.array()
        }
        next()
    },
    CRUDRoutes)
module.exports = app