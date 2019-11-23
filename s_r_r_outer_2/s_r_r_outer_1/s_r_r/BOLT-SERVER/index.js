var express = require('express');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var cors = require('cors');

/* eslint-disable */
var history = require('connect-history-api-fallback');
var CronJob = require('cron').CronJob;


//Batch file
var bat = require.resolve('./Backup/Backup.bat');
const exec = require('child_process').exec;

/* eslint-enable */





//CronJob
// new CronJob('00 */01 * * * *', function() {
//     exec(bat,function(err,stdout,stderr){
//         if(err){
//             console.log(err);
//         }else{
//             console.log('You will see this message every 60 second');
//             console.log(stdout);
//         }
//     });
//   }, null, true);

// globally initializing the session
//OLD SESSION
// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'ssshhhhh',
//     cookie: {
//       secure: false,
//     },
//   }));


//NEW SESSION
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret: 'ssshhhhh',
  store: new MongoStore({ mongooseConnection: mongoose.connection,
  ttl: 7 * 24 * 60 * 60,
  autoRemove: 'native' 
   }),
  cookie: {
          secure: false,
          maxAge: 60000 * 60 * 24 *7
        },
}));

//CORS
var corsOptions = {
    "origin": "http://127.0.0.1:1024",
    "optionsSuccessStatus": 204,
    "credentials": true,

};
app.use(cors(corsOptions));

//Profile Pictue
app.use('/ProfilePictures',express.static('ProfilePictures'));
app.use('/PurchaseOrders',express.static('PurchaseOrders'));
app.use('/Bills',express.static('Bills'));


// ***DO NOT PUBLIC ZIP FOLDER************
// app.use('/zip',express.static('zip'));
// *******************************************
//Model Loading

/* eslint-disable */ 
const SuperUser = require('./api/models/superuser_model');
const Company =  require('./api/models/company_model');
const User = require('./api/models/user_model');
const Log = require('./api/models/log_model');
const UserGroups = require('./api/models/user_group_model'); 
const Task = require('./api/models/tasks_model');
const Attendance = require('./api/models/attendance_model');
const Attribute = require('./api/models/add_attribute_model');
const Communications = require('./api/models/communication_model');
const Plugins = require('./api/models/plugins_model');
const SMTPSettings = require('./api/models/userSettings/smtpsettingsmodel');
const SMSSettings = require('./api/models/userSettings/smsSettingsmodel');
const MailTemplate = require('./api/models/mailTemplates/mail_templates_model');
const Context = require('./api/models/contextModels/context_model');
const SMSTemplate = require('./api/models/smsTemplates/sms_templates_model');
const CommunicationLog = require('./api/models/CommunicationLog/communication_log_model');
const Department = require('./api/models/Departments/department_model');
const UserTypePermissions = require('./api/models/userTypePermissions/userTypePermissionmodel');
const Designation = require('./api/models/Designation/designation_model');
const Heads = require('./api/models/Heads/heads_model');
const Label = require('./api/models/Labels/label_model');
const Budgeting = require('./api/models/Budgeting/budgeting_model');
const Vendor = require('./api/models/UserTypes/vendor_model');
const PurchaseOrder = require('./api/models/Transactions/Purchase_order');
const Quote = require('./api/models/Transactions/quotes_model');
const RFQ = require('./api/models/Transactions/RFQ_model');
const Transaction = require('./api/models/Transactions/transaction_model');
const Approval = require('./api/models/PreApprovals/Approval_model');
const BudgetSetting = require('./api/models/userSettings/BudgetSettingsModel');
const Staff = require('./api/models/UserTypes/staff_model');
const BudgetTransfer = require('./api/models/BudgetTransfer/BudgetTransferModel');
const PaymentOrders = require('./api/models/Transactions/Payment_Orders');
const CounterSchema = require('./api/models/Counters/CounterSchema');
const ApprovalTimeline = require('./api/models/ApprovalTimeline/Timeline');
const BudgetLogs = require('./api/models/Logs/BudgetLogs');
const BudgetTransferSettingsModel = require('./api/models/userSettings/BudgetTransferSettings');
const CarryOver = require('./api/models/CarryOver/CarryOver');
const BackupModel = require('./api/models/BackupInfo/BackupModel');
const Bill = require('./api/models/Transactions/BillModel');




//ACADEMICS MODELS
const StudentModel = require('./api/Academics/Academics Models/Student/StudentModel');
const ProgrammeModel = require('./api/Academics/Academics Models/Programme/ProgrammeModel');
const AcademicTermModel = require('./api/Academics/Academics Models/AcademicTerm/AcademicTermModel');
const SubjectModel = require('./api/Academics/Academics Models/Subjects/subjectsModel');
const SectionModel = require('./api/Academics/Academics Models/sections/sectionModels');
const AcademicEvent = require('./api/Academics/Academics Models/AcademicEvents/AcademicEvents');
const TTPlan = require('./api/Academics/Academics Models/TimeTablePlanner/TimeTablePlannerModel');

// SPEC 
const Specialisation = require('./api/Academics/Academics Models/SubjectSpecialisation/SubjectSpecialisationModel');
/* eslint-enable */



// mongoose instance connection url connection
mongoose.Promise = global.Promise;
const dbConfig = require('./config/database.config.js');
// Connecting to the database 
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify: false,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ADDING CLIENT

// app.use(express.static('public'));
// app.use(history({ verbose: true, index: '/' }));


// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });


app.get('/',function(req,res,next){
    res.status(403).send("FORBIDDEN");
});

const routes = require('./api/routes/projectX_routes');
const academic_routes = require('./api/Academics/Academics Routes/academic_routes');
app.use('/api',routes);
app.use('/academics',academic_routes);





app.listen(port);

console.log(" REST API server Started on "  +port);
