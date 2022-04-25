const { Root } = require('@helpers/connections')


const TestModalSchema = require('./TestModal')
const StudentSchema = require('./studentModal')
const TeacherModalSchema = require('./teacherModal')
const SpecialtySchema = require('./specialtyModal')
const OrganismeSchema = require('./organismeModal')
const SujetSchema = require('./sujetModal')

module.exports = {

    TestModal: Root.model("TestModal", TestModalSchema),
    StudentModal: Root.model("student", StudentSchema),
    TeacherModal: Root.model("teacher", TeacherModalSchema),
    SpecialtyModal: Root.model("specialty", SpecialtySchema),
    OrganismeModal: Root.model("organisme", OrganismeSchema),
    SujetModal: Root.model("sujet", SujetSchema),

}
