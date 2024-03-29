const express = require("express");
const app = express();
const Joi = require("joi");
const CRUDRoutes = require("@middlewares/CRUDRoute")
const studentRoutes = require("./studentRoutes")
const sujetRoutes = require("./sujetRoutes")

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
            encadrantS: Joi.any(),
            encadrantP: Joi.any(),
            specialites: Joi.any(),
            files: Joi.any(),
            binome: Joi.any(),
            //if sujet is validated it becomes locked
            organisme: Joi.any(),
            section: Joi.any(),
            type: Joi.any(),
            students: Joi.any(),
            code: Joi.number(),
        }
        next()
    },
    sujetRoutes)

module.exports = app