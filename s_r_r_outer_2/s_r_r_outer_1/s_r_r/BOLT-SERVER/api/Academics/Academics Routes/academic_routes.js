const express = require('express');
const router = express.Router();


//multer
var multer = require('multer');

//Profile picture
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./ProfilePictures/Student/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);

    },

});
const fileFilter = (req,file,cb) =>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true);
    }else{
        cb(new Error('Invalid File Type'),false);
    }
    //reject
};
var profile_picture = multer({
    storage:storage,
    fileFilter:fileFilter
});


// *********************************************
//Permission Middlewares
var VerifySuperUser = require('../../../auth/VerifySuperUser');
var VerifyCompany = require('../../../auth/VerifyCompany');


// *********************************************

// Module Middlewares
var moduleName_student = require('../ModuleMiddlewares/moduleName_student');
var moduleName_programme = require('../ModuleMiddlewares/moduleName_programme');
var moduleName_term = require('../ModuleMiddlewares/moduleName_term');
var moduleName_subject = require('../ModuleMiddlewares/moduleName_subject');
var moduleName_timetableplanner = require('../ModuleMiddlewares/moduleName_timetableplanner');



//Controllers
const StudentController = require('../Academics Controllers/Student/StudentController');
const ProgrammeController = require('../Academics Controllers/Programme/ProgrammeController');
const AcademicTermController = require('../Academics Controllers/Academic Term/AcademicTermController');
const SubjectController = require('../Academics Controllers/Subjects/SubjectsController');
const SectionController = require('../Academics Controllers/sections/sectionController');
const AcademicEventsController = require('../Academics Controllers/AcademicEvents/AcademicEventsController');
const SubjectSpecialisationController = require('../Academics Controllers/SubjectSpecialisationController/SubjectSpecialisationController');
const TimeTablePlannerController = require('../Academics Controllers/TimeTablePlanner/TimeTableController');

//STUDENT ROUTES
// moduleName == student
router.post('/stud/:moduleName/create',moduleName_student,VerifySuperUser,profile_picture.single('profile_pic'),StudentController.create_a_student);
router.post('/stud/:moduleName/login',moduleName_student,StudentController.login_a_student);
router.post('/stud/:moduleName/logout',moduleName_student,StudentController.logout_a_student);
router.get('/stud/:moduleName/view/all',moduleName_student,StudentController.find_all_students);
router.get('/stud/:moduleName/view/one/:studentId',moduleName_student,StudentController.view_a_student);
router.put('/stud/:moduleName/update/one/:studentId',moduleName_student,StudentController.update_a_student);
router.put('/stud/:moduleName/update/profile/pic/:studentId',moduleName_student,profile_picture.single('profile_pic'),StudentController.update_profile_pic);
router.delete('/stud/:moduleName/delete/one/:studentId',moduleName_student,StudentController.delete_a_student);


//PROGRAMME ROUTES
//moduleName == programme
router.post('/prog/:moduleName/create',moduleName_programme,ProgrammeController.create_a_Programme);
router.get('/prog/:moduleName/view/all',moduleName_programme,ProgrammeController.view_all_programme);
router.get('/prog/:moduleName/view/one/:progId',moduleName_programme,ProgrammeController.view_one_programme);
router.delete('/prog/:moduleName/delete/one/:progId',moduleName_programme,ProgrammeController.delete_a_programme);
router.put('/prog/:moduleName/update/one/:progId',moduleName_programme,ProgrammeController.update_a_programme);



//AcademicTerm ROUTES
// moduleName == term
router.post('/acad/:moduleName/create',moduleName_term,VerifyCompany,AcademicTermController.create_an_academic_term);
router.get('/acad/:moduleName/view/all/:progId',moduleName_term,VerifyCompany,AcademicTermController.view_all_academic_terms);
router.delete('/acad/:moduleName/delete/:deleteOption/:filterId',moduleName_term,AcademicTermController.delete_academic_terms);
router.put('/acad/:moduleName/update/one/:termId',moduleName_term,AcademicTermController.update_a_term);
router.get('/acad/:moduleName/view/one/:termId',moduleName_term,AcademicTermController.view_one_term);

//Subjects ROUTES
// moduleName == subject
router.post('/sub/:moduleName/create',moduleName_subject,VerifyCompany,SubjectController.create_a_subject);
router.get('/sub/:moduleName/view/all',moduleName_subject,SubjectController.view_all_subjects);
router.put('/sub/:moduleName/update/one/:subId',moduleName_subject,VerifyCompany,SubjectController.update_a_subject);
router.delete('/sub/:moduleName/delete/one/:subId',moduleName_subject,VerifyCompany,SubjectController.remove_a_subject);



//Section Routes
// moduleName == section
router.post('/sec/:moduleName/create',SectionController.create_a_section);
router.get('/sec/:moduleName/find/by/:filter/:filterId',SectionController.view_all_section);


//Events Routes
//moduleName == acadEvents

router.post('/events/:moduleName/create',AcademicEventsController.create_acad_event);
router.get('/events/:moduleName/view/all/events',AcademicEventsController.view_all_events);


//Specialisation Events
// moduleName == subspecs
router.post('/specs/:moduleName/create',VerifyCompany,SubjectSpecialisationController.create_a_specialisation);
router.get('/specs/:moduleName/get/all',VerifyCompany,SubjectSpecialisationController.view_all_specialisations);

//TimetablePlanner
//moduleName == timetableplanner
router.post('/ttplan/:moduleName',moduleName_timetableplanner,TimeTablePlannerController.create_a_time_table_planner);
router.delete('/ttplan/:moduleName/:document_id',moduleName_timetableplanner,TimeTablePlannerController.remove_a_ttplan);
router.put('/ttplan/:moduleName/update/one/:document_id',moduleName_timetableplanner,TimeTablePlannerController.update_a_ttplan);
router.get('/ttplan/:moduleName/view/one/:document_id',moduleName_timetableplanner,TimeTablePlannerController.find_a_ttplan_by_id);
router.get('/ttplan/:moduleName/view/all',moduleName_timetableplanner,TimeTablePlannerController.find_all_ttplan);


//router.get('/events/:moduleName/view/all/events',AcademicEventsController.view_all_events);

module.exports = router;
