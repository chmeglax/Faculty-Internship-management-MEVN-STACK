const express = require("express");
const app = express();
const Joi = require("joi");
const CRUDRoutes = require("@middlewares/CRUDRoute")
const teacherRoutes = require("./teacherRoutes")
const validationRoutes = require("./validationRoutes")

const passport = require("passport");

//? access infromation CRUD 
app.use("/test",
    //verify jwt middleware (user existence and expiration date)
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.locals.modelName = "TestModal"
        res.locals.validator = {
            fullName: Joi.string(),
            adress: Joi.string(),
            files: Joi.array(),
        }
        next()
    },
    CRUDRoutes)


app.use("/teacher",
    (req, res, next) => {
        res.locals.modelName = "TeacherModal"
        next()
    },
    teacherRoutes)
app.use("/specialty",
    (req, res, next) => {
        res.locals.modelName = "SpecialtyModal";
        res.locals.validator = {
            name: Joi.string().required(),
        }
        next()
    },
    CRUDRoutes)
app.use("/organisme",
    (req, res, next) => {
        res.locals.modelName = "OrganismeModal";
        res.locals.validator = {
            name: Joi.string().required(),
            adresse: Joi.any(),
            phone: Joi.any(),
            email: Joi.string().required(),
            secteur: Joi.any(),
        }
        next()
    },
    CRUDRoutes)

app.use("/validation",
    (req, res, next) => {
        res.locals.modelName = "ValidationModal"
        next()
    },
    validationRoutes)
module.exports = app