const { Root } = require('@helpers/connections')


const TestModalSchema = require('./TestModal')
const StudentSchema = require('./studentModal')
const TeacherSchema = require('./teacherModal')
const SpecialtySchema = require('./specialtyModal')
const OrganismeSchema = require('./organismeModal')
const SujetSchema = require('./sujetModal')
const ValidationSchema = require('./validationModal')
const SessionSchema = require('./sessionModal')
const SoutenanceSchema = require('./soutenanceModal')
const MarkSchema = require('./markModal')

module.exports = {

    TestModal: Root.model("TestModal", TestModalSchema),
    StudentModal: Root.model("student", StudentSchema),
    TeacherModal: Root.model("teacher", TeacherSchema),
    SpecialtyModal: Root.model("specialty", SpecialtySchema),
    OrganismeModal: Root.model("organisme", OrganismeSchema),
    SujetModal: Root.model("sujet", SujetSchema),
    ValidationModal: Root.model("validation", ValidationSchema),
    SessionModal: Root.model("session", SessionSchema),
    SoutenanceModal: Root.model("soutenance", SoutenanceSchema),
    MarkModal: Root.model("mark", MarkSchema),


}
