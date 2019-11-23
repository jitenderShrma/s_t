const express = require('express');
const router = express.Router();


//MULTIPART MIDDLEWARE
var multer = require('multer');
var upload = multer({dest: 'files/'});
var vendor = multer({dest: 'vendor/'});
var vendorFields = vendor.fields([{name:'pan_copy',maxCount:1},{name:'gst_certi',maxCount:1}]);
var quote = multer({dest: 'quotes/'});

//PROFILE PIC
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./ProfilePictures/');
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


//PO
const po_storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./PurchaseOrders/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }

});
var purchase_order_file = multer({
    storage:po_storage
});


//Bill(Transaction)
const bill_storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./Bills/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }

});
var bill_file = multer({
    storage:bill_storage
});

//CONTROLLERS
const AuthController = require('../controllers/AuthController');
const CompanyController = require('../controllers/CompanyController');
const UserController = require('../controllers/UserController');
const LogController = require('../controllers/LogController');
const UserGroupController = require('../controllers/UserGroupController');
const TaskController = require('../controllers/TaskController');
const AttendanceController = require('../controllers/AttendanceController');
const AttributeController = require('../controllers/AddAttributeController');
const PluginController = require('../controllers/PluginController');
const CommunicationController = require('../controllers/CommunicationController');
const SMTPSettingsController = require('../controllers/SettingsControllers/smtpController');
const SMSSettingsController = require('../controllers/SettingsControllers/smsController');
const MailTemplateConroller = require('../controllers/mailTemplatesControllers/mailTemplatesController');
const ContextController = require('../controllers/contextControllers/contextControllers');
const SMSTemplateController = require('../controllers/smsTemplateControllers/smsTemplatesController');
const CommunicationLogsController = require('../controllers/communicationLog/communicationLogController');
const DepartmentController = require('../controllers/departmentController/departmentController');
const UserTypePermissions = require('../controllers/userTypePermissionController.js/userTypePermissions');
const DesignationController  =require('../controllers/DesignationController/Designation_controller');
const HeadController = require('../controllers/Heads/heads_controller');
const LabelController = require('../controllers/labelController/LabelController');
const BudgetController = require('../controllers/Budgeting/BudgetingController');
const VendorController = require('../controllers/UserType/VendorController');
const PurchaseOrderController = require('../controllers/Transactions/PurchaseOrderController');
const QuoteController = require('../controllers/Transactions/QuoteController');
const RFQController = require('../controllers/Transactions/RFQController');
const TransactionController = require('../controllers/Transactions/TransactionController');
const ApprovalsController = require('../controllers/PreApprovals/ApprovalsController');
const BudgetSettingController = require('../controllers/SettingsControllers/BudgetSettingController');
const StaffController = require('../controllers/UserType/StaffController');
const DropDownController = require('../controllers/DropDownControllers/DropDownController');
const TransactionImportController = require('../controllers/ImportControllers/TransactionImportController');
const BudgetTransferController = require('../controllers/BudgetTransfer/BudgetTransfer');
const PaymentOrderController = require('../controllers/Transactions/PaymentOrderController');
const HeadsImportController = require('../controllers/ImportControllers/HeadsImportController');
const LineManagerController = require('../controllers/LineManagers/LineManagerController');
const TimeLineController = require('../controllers/ApprovalTimeline/TimelineController');
const BudgetTransferSettingsController = require('../controllers/SettingsControllers/BudgetTransferSettingController');
const CarryOverController = require('../controllers/BudgetCarryover/BudgetCarryOver');
const BackupController = require('../controllers/BackupInfo/BackupController');
const NotFoundController = require('../controllers/404Controller/404Controller');
const BillController = require('../controllers/Transactions/BillController');


//MIDDLEWARES

var VerifyToken = require('../../auth/VerifyToken');
var VerifySuperUser = require('../../auth/VerifySuperUser');
var addLog = require('../controllers/LogMiddlewareController');
var sendMail = require('../../coms/mail_middleware');
var VerifyCompany = require('../../auth/VerifyCompany');

var ComMiddleware = require('../controllers/CommunicationsExtensionsControllers/ComController');
var BudgetLogMiddleware = require('../Logs Middleware/BudgetLogMiddleware');


//LINE MANAGER MIDDLEWARE
var LinerManagers = require('../SupportModules/LineManager');
var UsersAtDesignation = require('../SupportModules/UsersFromDesignation');


//MAIL MIDDLEWARE

// var AxiosMiddleware = require('../controllers/axios_Controller/axiosController');


//ModuleName MiddleWares
var ModuleName_auth = require('../module_middlewares/moduleName_auth');
var ModuleName_company = require('../module_middlewares/moduleName_company');
var ModuleName_subuser = require('../module_middlewares/moduleName_subuser');
var moduleName_subgroup = require('../module_middlewares/moduleName_subgroup');
var moduleName_dept = require('../module_middlewares/moduleName_dept');
var moduleName_label = require('../module_middlewares/moduleName_label');
var moduleName_preApp = require('../module_middlewares/moduleName_preApp');
var moduleName_budSet = require('../module_middlewares/moduleName_budSet');
var moduleName_staff = require('../module_middlewares/moduleName_staff');
var moduleName_head = require('../module_middlewares/moduleName_head');
var moduleName_trans = require('../module_middlewares/moduleName_trans');
var moduleName_vendor = require('../module_middlewares/moduleName_vendor');
var moduleName_budtrans = require('../module_middlewares/moduleName_budtrans');
var moduleName_budtransSet = require('../module_middlewares/moduleName_budtransSet');
var moduleName_carryover = require('../module_middlewares/moduleName_carryover');
var moduleName_purchaseOrder = require('../module_middlewares/moduleName_purchaseOrder');
var moduleName_bill = require('../module_middlewares/moduleName_bill');




//Permission MiddleWares
var VerifyPermission = require('../permissions_middleware/permission_middleware');
var ReadPermission = require('../permissions_middleware/read/read_permission');
var WritePermission = require('../permissions_middleware/write/write_permission');
var EditPermission = require('../permissions_middleware/edit/edit_permission');
var DeletePermission = require('../permissions_middleware/delete/delete_permission');

//Additional Permissions Middleware
var AdditionalReadPermission = require('../permissions_middleware/additional_permission_middleware');
var DeleteOwnPermission = require('../permissions_middleware/delete/delete_own_permission');
var EditOwnPermission = require('../permissions_middleware/edit/edit_own');

//Approval Additional Permissions
var ApprovalAdditionalPermission = require('../permissions_middleware/approval_additional_permissions');


// SEND SMTP MAIL ROUTE

router.post('/send/mail/smtp',ComMiddleware.get_SMTP_Settings,ComMiddleware.view_a_mail_template,CommunicationLogsController.add_a_communication_log,ComMiddleware.send_a_mail_smtp);
router.post('/send/text/sms',ComMiddleware.get_SMS_Settings,ComMiddleware.view_a_sms_template,CommunicationLogsController.add_a_communication_log,ComMiddleware.send_a_text_sms);




// SuperUser routes
// moduleName == "auth"
router.post('/:moduleName/super/register',ModuleName_auth,AuthController.create_a_Super_User);
router.get('/:moduleName/super/me',ModuleName_auth,VerifyToken,AuthController.get_a_Super_User); //WITH TOKEN
router.post('/:moduleName/super/login',ModuleName_auth,AuthController.login_a_user,UserController.login_a_User,UserController.fetch_a_permission);   //Corrected
router.get('/:moduleName/super/logout',ModuleName_auth,AuthController.logout_a_user);
router.put('/:moduleName/super/update/:superId',ModuleName_auth,VerifyToken,AuthController.update_a_user); //CHANGED

// SUPER USER SETTINGS
router.get('/super/get/settings',VerifySuperUser,AuthController.get_super_settings);

//!!!!!SUPER_DELETE_ROUTE!!!!\\

router.delete('/super/:superId/delete/:superPassword',AuthController.delete_a_user);


// !!!!!!!!!!!!!END!!!!!!!!!!!!!!!!!!!!


// Company routes

//moduleName == "company"
router.post('/:moduleName/add',ModuleName_company,CompanyController.create_a_Company);
router.get('/:moduleName/list',ModuleName_company,CompanyController.get_all_Companies,addLog);
router.get('/:moduleName/:companyId',ModuleName_company,VerifyPermission,ReadPermission,CompanyController.get_a_company,addLog);
router.put('/:moduleName/:companyId',ModuleName_company,VerifyPermission,EditPermission,CompanyController.update_a_Company,addLog);
router.delete('/:moduleName/:companyId',ModuleName_company,VerifyPermission,DeletePermission,CompanyController.delete_a_Company,addLog);


//LOG Routes


router.get('/view/log',LogController.view_a_log);


// ******************************************************************



// Users routes
//:moduleName == subuser

router.post('/user/:moduleName/add',ModuleName_subuser,VerifyPermission,WritePermission,profile_picture.single('profile_picture'),UserController.create_a_User);

router.get('/user/:moduleName/see/all',ModuleName_subuser,VerifyCompany,VerifyPermission,ReadPermission,AdditionalReadPermission,UserController.get_all_Users);

router.get('/user/:moduleName/see/professors',ModuleName_subuser,VerifyCompany,VerifyPermission,ReadPermission,AdditionalReadPermission,UserController.get_all_professors);

router.get('/user/:moduleName/get/:userId',ModuleName_subuser,VerifyCompany,VerifyPermission,ReadPermission,UserController.get_a_User);

router.put('/user/:moduleName/edit/:userId',ModuleName_subuser,VerifyCompany,VerifyPermission,EditPermission,EditOwnPermission,UserController.update_a_User);

router.delete('/user/:moduleName/delete/:userId',ModuleName_subuser,VerifyCompany,VerifyPermission,DeletePermission,DeleteOwnPermission,UserController.delete_a_User);

router.put('/user/:moduleName/push/:userId',ModuleName_subuser,VerifyCompany,VerifyPermission,EditPermission,UserController.push_a_permission);

// SUBUSER LOGOUT/LOGIN ROUTES
router.post('/user/:moduleName/login', UserController.login_a_User,UserController.fetch_a_permission);
router.post('/user/:moduleName/logout', UserController.logout_a_User);



//USER GROUPS
//:moduleName == subgroup
router.post('/super/group/:moduleName/add',moduleName_subgroup,VerifyPermission,VerifyCompany,WritePermission,UserGroupController.create_a_usergroup);
router.get('/super/group/:moduleName/getall',moduleName_subgroup,VerifyPermission,VerifyCompany,ReadPermission,UserGroupController.get_all_groups);
router.get('/super/group/:moduleName/getone/:usergroupId',moduleName_subgroup,VerifyPermission,VerifyCompany,ReadPermission,UserGroupController.get_a_usergroup);
router.put('/super/group/:moduleName/edit/:usergroupId',moduleName_subgroup,VerifyPermission,VerifyCompany,EditPermission,UserGroupController.edit_a_usergroup);
router.put('/super/group/:moduleName/update/:userGroup',moduleName_subgroup,VerifySuperUser,UserGroupController.add_a_usergroup_module);
// push/pop a subgroup
// router.put('/super/group/:moduleName/push/:userGroup',moduleName_subgroup,VerifySuperUser,VerifyCompany,UserGroupController.add_a_subgroup);
// router.put('/super/group/:moduleName/pop/:userGroup',moduleName_subgroup,VerifySuperUser,VerifyCompany,UserGroupController.remove_a_subgroup);
// push/pop a label
router.put('/super/group/:moduleName/push/label/:userGroup',moduleName_subgroup,VerifySuperUser,VerifyCompany,UserGroupController.add_a_label);
router.put('/super/group/:moduleName/pop/label/:userGroup',moduleName_subgroup,VerifySuperUser,VerifyCompany,UserGroupController.remove_a_label);
//DELETE A SUBGROUP
router.delete('/super/group/:moduleName/delete/:groupId',moduleName_subgroup,VerifySuperUser,VerifyCompany,UserGroupController.delete_a_subgroup);
//fetch from user group name
router.get('/super/group/:moduleName/find/by/:name',moduleName_subgroup,VerifyCompany,UserGroupController.fetch_something); 
router.put('/super/group/:moduleName/edit/by/:name',moduleName_subgroup,VerifyCompany,UserGroupController.edit_staff); 


// GET NESTED USERGROUPS
// router.get('/my/path/get',VerifyCompany,UserTypePermissions.get_all_usertypes);


//TASK ROUTES

router.post('/tasks/add',VerifySuperUser,TaskController.create_a_task,sendMail);
router.get('/tasks/viewall',VerifySuperUser,TaskController.view_a_task);


//ATTENDANCE ROUTES

router.post('/super/attendance/add',VerifySuperUser,VerifyCompany,AttendanceController.create_a_Attendance);
router.get('/super/attendance/view',VerifySuperUser,VerifyCompany,AttendanceController.view_all_Attendance);


//ATTRIBUTE ROUTES
router.get('/super/attrib/view',VerifySuperUser,AttributeController.view_all_attributes);
router.post('/super/attrib/add',VerifySuperUser,AttributeController.add_an_attribute);

router.get('/super/attrib/get/:attribId/:context',VerifySuperUser,AttributeController.get_an_attribute);
router.put('/super/attrib/update/:attribId/:context',VerifySuperUser,AttributeController.update_an_attribute);
router.delete('/super/attrib/delete/:attribId/:context',VerifySuperUser,AttributeController.delete_an_attribute);


//PLUGIN ROUTES
router.post('/super/plugin/release',PluginController.release_a_plugin);
router.get('/super/plugin/see',VerifySuperUser,PluginController.see_available_plugins);


//COMMUNICATION ROUTES
router.post('/super/com/install',VerifySuperUser,CommunicationController.install_a_com);
router.get('/super/com/view',VerifySuperUser,CommunicationController.view_a_com);
router.delete('/super/com/uninstall/:moduleName',VerifySuperUser,CommunicationController.uninstall_a_com);


// SMTP SETTINGS ROUTES
router.post('/super/settings/smtp/add',VerifySuperUser,SMTPSettingsController.add_a_setting);
router.get('/super/settings/smtp/view',VerifySuperUser,SMTPSettingsController.view_a_setting);
router.put('/super/settings/smtp/update',VerifySuperUser,SMTPSettingsController.update_a_setting);



// SMS SETTINGS ROUTES

router.post('/super/settings/sms/add',VerifySuperUser,SMSSettingsController.add_a_setting);
router.get('/super/settings/sms/view',VerifySuperUser,SMSSettingsController.view_a_setting);
router.put('/super/settings/sms/update',VerifySuperUser,SMSSettingsController.update_a_setting);


//MAIL TEMPLATE ROUTES

router.post('/mail/template/add',VerifySuperUser,MailTemplateConroller.add_a_mail_template);
router.get('/mail/template/view',VerifySuperUser,MailTemplateConroller.view_all_mail_templates);

router.get('/mail/template/view/:mailId',VerifySuperUser,MailTemplateConroller.view_a_mail_template);
router.put('/mail/template/edit/:mailId',VerifySuperUser,MailTemplateConroller.edit_a_mail_template);
router.delete('/mail/template/delete/:mailId',MailTemplateConroller.delete_a_mail_template);

//SMS TEMPLATE ROUTES

router.post('/sms/template/add',VerifySuperUser,SMSTemplateController.add_a_sms_template);
router.get('/sms/template/view',VerifySuperUser,SMSTemplateController.view_all_sms_templates);

router.get('/sms/template/view/:smsId',VerifySuperUser,SMSTemplateController.view_a_sms_template);
router.put('/sms/template/edit/:smsId',VerifySuperUser,SMSTemplateController.edit_a_sms_template);
router.delete('/sms/template/delete/:mailId',VerifySuperUser,SMSTemplateController.delete_a_sms_template);


//CONTEXT ROUTES

router.post('/context/create',VerifySuperUser,ContextController.create_a_context);
router.get('/context/context/find',VerifySuperUser,ContextController.read_all_context);
router.get('/context/find/one/:contextId',VerifySuperUser,ContextController.read_a_context);


//COMMUNICATION LOGS ROUTES
router.get('/comms/logs/find',VerifySuperUser,CommunicationLogsController.view_all_logs);
router.post('/comms/logs/create',VerifySuperUser,CommunicationLogsController.add_a_communication_log);
router.put('/comms/logs/edit/:logId',CommunicationLogsController.edit_a_log);


//DEPARTMENT ROUTES
//moduleName == "dept"
router.post('/department/:moduleName/create',moduleName_dept,VerifyPermission,WritePermission,VerifyCompany,DepartmentController.create_a_department);
router.get('/department/:moduleName/get',moduleName_dept,VerifyPermission,ReadPermission,AdditionalReadPermission,VerifyCompany,DepartmentController.read_all_departments);
router.get('/department/:moduleName/get/:deptId',moduleName_dept,VerifyPermission,ReadPermission,VerifyCompany,DepartmentController.find_a_department);
router.put('/department/:moduleName/edit/:deptId',moduleName_dept,VerifyPermission,EditPermission,VerifyCompany,DepartmentController.update_a_department);
router.delete('/department/:moduleName/delete/:deptId', moduleName_dept,VerifyPermission,DeletePermission,DeleteOwnPermission,VerifyCompany,DepartmentController.delete_a_department);
router.get('/department/:moduleName/child/:deptId',moduleName_dept,VerifyPermission,ReadPermission,VerifyCompany,DepartmentController.get_child_dept);
// push/pop a label
router.put('/department/:moduleName/push/label/:deptId',moduleName_dept,VerifyCompany,VerifyPermission,EditPermission,DepartmentController.add_a_label);
router.put('/department/:moduleName/pop/label/:deptId',moduleName_dept,VerifyCompany,VerifyPermission,EditPermission,DepartmentController.remove_a_label);

// ************* REMOVED FIX ROUTES ******************
// router.get('/department/:moduleName/fix/all',DepartmentController.fix_all_departments);
// router.get('/department/:moduleName/fix/index',DepartmentController.fix_all_index);

//USER TYPE PERMISSIONS ROUTES

//moduleName=="usertype"

router.post('/:moduleName/permission/create',VerifySuperUser,VerifyCompany,UserTypePermissions.create_a_permission);
router.get('/:moduleName/permission/view/all',VerifySuperUser,VerifyCompany,UserTypePermissions.view_all_permissions);

router.get('/:moduleName/permission/view/one/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.view_a_permission);
router.put('/:moduleName/permission/update/one/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.update_a_permission);
// push/pop routes for permission
router.put('/:moduleName/permission/push/one/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.push_a_permission);
router.put('/:moduleName/permission/pop/one/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.pop_a_permission);
// push/pop routes for subgroups
// router.get('/:moduleName/usertype/get/all',VerifySuperUser,VerifyCompany,UserTypePermissions.get_all_usertypes);
router.put('/:moduleName/subgroup/push/one/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.push_a_subgroup);
router.put('/:moduleName/subgroup/pop/one/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.pop_a_subgroup);
// push/pop routes for labels
router.put('/:moduleName/label/push/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.push_a_label);
router.put('/:moduleName/label/pop/:userType',VerifySuperUser,VerifyCompany,UserTypePermissions.pop_a_label);



//DESIGNATION ROUTES
//moduleName == "desig"

router.post('/designation/:moduleName/create',VerifyPermission,VerifyCompany,WritePermission,DesignationController.create_a_designation);
router.get('/designation/:moduleName/get/all',VerifyPermission,VerifyCompany,ReadPermission,AdditionalReadPermission,DesignationController.read_all_designations);
router.get('/designation/:moduleName/get/one/:desigId',VerifyPermission,VerifyCompany,ReadPermission,DesignationController.read_a_designation);
router.put('/designation/:moduleName/update/:desId',VerifyPermission,VerifyCompany,EditPermission,DesignationController.update_a_designation);
router.delete('/designation/:moduleName/delete/:desId',VerifyPermission,VerifyCompany,DeletePermission,DeleteOwnPermission,DesignationController.delete_a_designation);
router.get('/designation/:moduleName/find/:deptId',VerifyPermission,VerifyCompany,DesignationController.get_dept_designation);
// push/pop a label
router.put('/designation/:moduleName/push/label/:desigId',VerifySuperUser,VerifyCompany,DesignationController.push_desig_label);
router.put('/designation/:moduleName/pop/label/:desigId',VerifySuperUser,VerifyCompany,DesignationController.pop_desig_label);

//HEADS ROUTES
//moduleName == "head"
router.post('/head/:moduleName/create',moduleName_head,VerifyCompany,VerifyPermission,WritePermission,HeadController.create_a_head);
router.get('/head/:moduleName/get',moduleName_head,VerifyCompany,VerifyPermission,ReadPermission,AdditionalReadPermission,HeadController.read_all_heads);
router.get('/head/:moduleName/view/one/:headId',moduleName_head,VerifyCompany,VerifyPermission,ReadPermission,HeadController.read_a_head);
router.delete('/head/:moduleName/delete/one/:headId',moduleName_head,VerifyCompany,VerifyPermission,DeletePermission,DeleteOwnPermission,HeadController.delete_a_head);
router.put('/head/:moduleName/update/one/:headId',moduleName_head,VerifyCompany,VerifyPermission,EditPermission,HeadController.update_a_head);
router.put('/head/:moduleName/update/only/values/:headId',moduleName_head,VerifyPermission,EditPermission,HeadController.update_head_values,BudgetLogMiddleware); // HEAD UPDATE VALUES
router.get('/head/:moduleName/find/:deptId',moduleName_head,VerifyCompany,VerifyPermission,ReadPermission,HeadController.get_dept_head);
// push/pop a label
router.put('/head/:moduleName/push/label/:headId',moduleName_head,VerifyCompany,VerifyPermission,EditPermission,HeadController.add_a_label);
router.put('/head/:moduleName/pop/label/:headId',moduleName_head,VerifyCompany,VerifyPermission,EditPermission,HeadController.remove_a_label);

//LABEL ROUTES
//moduleName == "label"

router.get('/label/:moduleName/get/all',moduleName_label,VerifyPermission,ReadPermission,VerifyCompany,LabelController.get_all_labels);
router.get('/label/:moduleName/get/one/:labelId',moduleName_label,VerifyPermission,ReadPermission,VerifyCompany,LabelController.get_a_label);
router.post('/label/:moduleName/create',moduleName_label,VerifyPermission,WritePermission,VerifyCompany,LabelController.add_a_label);
router.put('/label/:moduleName/edit/:labelId',moduleName_label,VerifyPermission,EditPermission,VerifyCompany,LabelController.edit_a_label);
router.delete('/label/:moduleName/delete/:labelId',moduleName_label,VerifyPermission,DeletePermission,VerifyCompany,LabelController.delete_a_label);
router.get('/label/:moduleName/find/by/:context',moduleName_label,VerifyPermission,ReadPermission,VerifyCompany,LabelController.find_labels_by_context);


//CSV Routes(BUDGET UPLOAD)

router.post('/csv/read',upload.single('csv'),VerifySuperUser,VerifyCompany,BudgetController.read_a_csv_quaterly);
router.get('/csv/read/Q',HeadController.get_heads_quaterly);
router.get('/csv/read/M/:companyId',BudgetSettingController.fetch_a_budget_setting,HeadController.get_heads_monthly);
router.get('/csv/read/M/amount/left/:companyId',BudgetSettingController.fetch_a_budget_setting,HeadController.get_heads_monthly_left);

// Vendor Routes
//moduleName = "vendor"

router.get("/vendor/:moduleName/get/all",moduleName_vendor,VerifyCompany,VerifyPermission,ReadPermission,VendorController.get_all_vendors);
router.get("/vendor/:moduleName/get/:vendorId",moduleName_vendor,VerifyCompany,VerifyPermission,ReadPermission,VendorController.get_a_vendor);
router.post("/vendor/:moduleName/create",moduleName_vendor,VerifyCompany,VerifyPermission,WritePermission,vendorFields,VendorController.create_a_vendor);
router.put("/vendor/:moduleName/edit/:vendorId",moduleName_vendor,VerifyCompany,VerifyPermission,EditPermission,VendorController.edit_a_vendor);
router.delete("/vendor/:moduleName/delete/:vendorId",moduleName_vendor,VerifyCompany,VerifyPermission,DeletePermission,VendorController.delete_a_vendor);



// Purchase order routes
// moduleName == purchaseOrder

router.get('/po/:moduleName/get/all',moduleName_purchaseOrder,VerifySuperUser,VerifyCompany,PurchaseOrderController.get_all_pos);
router.get('/po/:moduleName/get/:poId',moduleName_purchaseOrder,VerifySuperUser,VerifyCompany,PurchaseOrderController.view_a_po);
router.post('/po/:moduleName/create',moduleName_purchaseOrder,VerifyCompany,purchase_order_file.array('po_file', 20),PurchaseOrderController.create_a_po);
router.put('/po/:moduleName/edit/:poId',moduleName_purchaseOrder,VerifySuperUser,VerifyCompany,PurchaseOrderController.edit_a_po);
router.delete('/po/:moduleName/delete/:poId',moduleName_purchaseOrder,VerifySuperUser,VerifyCompany,PurchaseOrderController.delete_a_po);

// Quotes routes

router.get('/quote/get/all',VerifySuperUser,VerifyCompany,QuoteController.get_all_quotes);
router.get('/quote/get/:quoteId',VerifySuperUser,VerifyCompany,QuoteController.view_a_quote);
router.post('/quote/create',VerifySuperUser,VerifyCompany,quote.single('file'),QuoteController.create_a_quote);
router.put('/quote/edit/:quoteId',VerifySuperUser,VerifyCompany,quote.single('file'),QuoteController.edit_a_quote);
router.delete('/quote/delete/:quoteId',VerifySuperUser,VerifyCompany,QuoteController.delete_a_quote);

// RFQ routes

router.get('/rfq/get/all',VerifySuperUser,VerifyCompany,RFQController.get_all_rfqs);
router.get('/rfq/get/:rfqId',VerifySuperUser,VerifyCompany,RFQController.view_a_rfq);
router.post('/rfq/create',VerifySuperUser,VerifyCompany,RFQController.create_a_rfq);
router.put('/rfq/edit/:rfqId',VerifySuperUser,VerifyCompany,RFQController.edit_a_rfq);
router.delete('/rfq/delete/:rfqId',VerifySuperUser,VerifyCompany,RFQController.delete_a_rfq);
//push/pop a quote
router.put('/rfq/push/:rfqId',VerifySuperUser,VerifyCompany,RFQController.push_a_quote);
router.put('/rfq/pop/:rfqId',VerifySuperUser,VerifyCompany,RFQController.pop_a_quote);


//BILL ROUTES
//moduleName == bill
router.post('/bill/:moduleName/create',moduleName_bill,VerifyCompany,bill_file.single('bill_file'),BillController.create_a_bill);
router.put('/bill/:moduleName/update/one/:billId',moduleName_bill,VerifyCompany,VerifyPermission,EditPermission,BillController.update_a_bill);


router.get('/bill/:moduleName/manage/transaction/bill',moduleName_bill,BillController.manage_transition_bill);
router.delete('/bill/:moduleName/manage/delete/all',moduleName_bill,BillController.delete_bills);
router.get('/bill/:moduleName/manage/remove_bills_from_trans',moduleName_bill,BillController.remove_bills_from_trans);


// Transaction routes

//moduleName == trans

//NEW ROUTES

//PERMISSION ADDED
router.get('/transaction/:moduleName/page/:pageNo',moduleName_trans,VerifyCompany,VerifyPermission,ReadPermission,AdditionalReadPermission,TransactionController.get_all_transactions_page);
router.get('/transaction/:moduleName/get/all',moduleName_trans,VerifyCompany,VerifyPermission,ReadPermission,AdditionalReadPermission,TransactionController.get_all_transactions);
router.get('/transaction/:moduleName/get/one/:transactionId',moduleName_trans,VerifyCompany,TransactionController.view_a_transaction);
router.get('/transaction/:moduleName/vendor/:vendorId',moduleName_trans,VerifyCompany,TransactionController.check_vendor_transaction);
router.get('/transaction/:moduleName/vendordetail/:vendorId',moduleName_trans,VerifyCompany,TransactionController.vendor_transactions);
router.post('/transaction/:moduleName/filter/user',moduleName_trans,VerifyCompany,ReadPermission,AdditionalReadPermission,TransactionController.filter_transactions_user);
router.post('/transaction/:moduleName/filter/get',moduleName_trans,VerifyCompany,ReadPermission,AdditionalReadPermission,TransactionController.filter_transactions);
router.post('/transaction/:moduleName/superuser/get',moduleName_trans,VerifyCompany,ReadPermission,AdditionalReadPermission,TransactionController.filter_superuser_transactions);
router.post('/transaction/:moduleName/create',moduleName_trans,VerifyCompany,VerifyPermission,WritePermission,bill_file.single('bill_file'),TransactionController.create_a_transaction);
router.put('/transaction/:moduleName/edit/:transactionId',moduleName_trans,VerifyCompany,bill_file.single('bill_file'),TransactionController.edit_a_transaction);
router.delete('/transaction/:moduleName/delete/:transactionId',moduleName_trans,VerifyCompany,VerifyPermission,DeletePermission,TransactionController.delete_a_transaction);
//push/pop a quote
router.put('/transaction/push/:transactionId',VerifyCompany,TransactionController.push_a_quote);
router.put('/transaction/pop/:transactionId',VerifyCompany,TransactionController.pop_a_quote);


//transaction with payments
router.get('/transaction/:moduleName/get/all/with/payments/:vendorId',moduleName_trans,VerifyCompany,VerifyPermission,ReadPermission,TransactionController.get_all_transactions_with_payments);


//Cancel
router.put('/transaction/:moduleName/cancel/:transactionId',moduleName_trans,VerifyCompany,VerifyPermission,DeletePermission,TransactionController.cancel_a_transaction);

//view all transactions for an approval
router.get('/transaction/:moduleName/get/for/an/:uniqueId',TransactionController.view_all_transaction_for_an_approval);




//Approval Routes
//moduleName == preApp
router.post('/approvals/:moduleName/create',moduleName_preApp,VerifyPermission,WritePermission,ApprovalAdditionalPermission,VerifyCompany,BudgetSettingController.fetch_a_budget_setting,ApprovalsController.create_a_approval,LinerManagers,ApprovalsController.manage_an_approval);
router.get('/approvals/:moduleName/get/all',moduleName_preApp,VerifyPermission,ReadPermission,AdditionalReadPermission,VerifyCompany,ApprovalsController.find_all_approvals);
router.post('/approvals/:moduleName/filter/get',moduleName_preApp,VerifyPermission,ReadPermission,AdditionalReadPermission,VerifyCompany,ApprovalsController.filter_approvals);
router.post('/approvals/:moduleName/filter/user',moduleName_preApp,VerifyPermission,ReadPermission,AdditionalReadPermission,VerifyCompany,ApprovalsController.filter_approvals_user);
router.get('/approvals/:moduleName/get/count',moduleName_preApp,VerifyPermission,ReadPermission,AdditionalReadPermission,VerifyCompany,ApprovalsController.send_pending_approval_count)
router.get('/approvals/:moduleName/get/one/:uniqueId',moduleName_preApp,VerifyPermission,ReadPermission,ApprovalsController.find_an_approval);
router.get('/reset/one/counter',ApprovalsController.reset_a_counter); //Counter reset column ONLY IN DEV MODE
// push/pop a label
router.put('/approvals/:moduleName/push/label/:uniqueId',moduleName_preApp,VerifyCompany,VerifyPermission,EditPermission,ApprovalsController.add_a_label);
router.put('/approvals/:moduleName/pop/label/:uniqueId',moduleName_preApp,VerifyCompany,VerifyPermission,EditPermission,ApprovalsController.remove_a_label);
router.get('/approvals/:moduleName/view/requests',moduleName_preApp,VerifyCompany,ApprovalsController.view_all_requests);

//cancel an Approval
router.put('/approvals/:moduleName/cancel/label/:uniqueId',moduleName_preApp,ApprovalsController.cancel_a_approval);
// release an Approval
router.get('/approvals/:moduleName/release/:uniqueId',moduleName_preApp,ApprovalsController.release_an_approval);



//BUDGET SETTING ROUTES
//moduleName == budSet
router.post('/super/settings/budget/:moduleName/create',moduleName_budSet,VerifySuperUser,VerifyCompany,BudgetSettingController.create_a_budget_setting);
router.get('/super/settings/budget/:moduleName/get',moduleName_budSet,VerifyPermission,VerifyCompany,ReadPermission,BudgetSettingController.get_a_budget_setting);
router.put('/super/settings/budget/:moduleName/update',moduleName_budSet,VerifySuperUser,VerifyCompany,BudgetSettingController.update_a_budget_setting);

//moduleName == budtransSet
router.post('/super/settings/budget/transfer/:moduleName/create',moduleName_budtransSet,VerifySuperUser,VerifyCompany,BudgetTransferSettingsController.create_a_budget_transfer_setting);
router.get('/super/settings/budget/transfer/:moduleName/get',moduleName_budtransSet,VerifyPermission,VerifyCompany,ReadPermission,BudgetTransferSettingsController.get_a_budget_transfer_setting);
router.put('/super/settings/budget/transfer/:moduleName/update',moduleName_budtransSet,VerifySuperUser,VerifyCompany,BudgetTransferSettingsController.update_a_budget_transfer_setting);



//LEVEL APPROVAL PATHS

router.post('/approval/level1/accept/:uniqueId',BudgetSettingController.fetch_a_budget_setting,ApprovalsController.accept_an_approval);
router.post('/approval/level1/reject/:uniqueId',BudgetSettingController.fetch_a_budget_setting,ApprovalsController.level1_rejection);

// Staff Routes
// moduleName == staff

router.post('/staff/:moduleName/create',moduleName_staff,VerifyCompany,StaffController.create_a_staff);
router.get('/staff/:moduleName/get/all',moduleName_staff,VerifyCompany,StaffController.find_all_staff);

router.get('/staff/:moduleName/get/one/:staffId',moduleName_staff,VerifyCompany,StaffController.find_a_staff);
router.put('/staff/:moduleName/update/one/:staffId',moduleName_staff,VerifyCompany,StaffController.update_a_staff);
router.delete('/staff/:moduleName/delete/one/:staffId',moduleName_staff,VerifyCompany,StaffController.delete_a_staff);



//DROPDOWN ROUTES

router.get('/dropdown/department/get/all',VerifyCompany,DepartmentController.read_all_departments);
router.get('/dropdown/designation/no/dept',VerifyCompany,DropDownController.get_designation_with_no_department);
router.get('/dropdown/designation/find/:deptId',VerifyCompany,DesignationController.get_dept_designation);
router.get('/dropdown/head/find/:deptId',VerifyCompany,HeadController.get_dept_head);
router.get('/dropdown/head/only/:deptId',VerifyCompany,HeadController.get_dept_head_only);
router.get('/dropdown/desig/only/:deptId',VerifyCompany,DesignationController.get_dept_desig_only);
router.get('/dropdown/head/no/dept',VerifyCompany,DropDownController.get_heads_with_no_department);
router.get('/dropdown/designation/count/:deptId',VerifyCompany,DesignationController.get_dept_designation_count);
router.get('/dropdown/head/count/:deptId',VerifyCompany,HeadController.get_dept_head_count);


//IMPORT ROUTES

//moduleName == importTrans

router.post('/import/:moduleName/transactions/all',upload.single('csv'),VerifyCompany,VerifyPermission,WritePermission,TransactionImportController.import_a_transaction);


//Transfer Budget
//moduleName == budtrans

router.post('/transfer/:moduleName/budget/monthly',moduleName_budtrans,VerifyCompany,VerifyPermission,WritePermission,BudgetTransferSettingsController.fetch_a_budget_transfer_setting,BudgetTransferController.transfer_a_budget,LinerManagers,BudgetTransferController.manage_a_budget_transfer);
router.get('/transfer/:moduleName/view/requests/all',moduleName_budtrans,VerifyCompany,VerifyPermission,ReadPermission,BudgetTransferController.get_all_budget_transfer_requests);
router.get('/transfer/:moduleName/get/count',moduleName_budtrans,VerifyCompany,VerifyPermission,ReadPermission,BudgetTransferController.send_pending_approval_count)
router.get('/transfer/:moduleName/view/requests/pending',moduleName_budtrans,VerifyCompany,VerifyPermission,ReadPermission,BudgetTransferController.get_pending_budget_transfer_requests);
router.post('/transfer/:moduleName/accept/requests/:budtransId',moduleName_budtrans,BudgetTransferSettingsController.fetch_a_budget_transfer_setting,BudgetTransferController.budget_transfer_approval);
router.post('/transfer/:moduleName/reject/requests/:budtransId',moduleName_budtrans,BudgetTransferSettingsController.fetch_a_budget_transfer_setting,BudgetTransferController.budget_transfer_rejection);

//Payment Orders Controller

// moduleName == paymentorder

router.post('/payments/:moduleName/create',VerifyCompany,PaymentOrderController.create_a_payment_order); 
router.get('/payments/:moduleName/find/all',VerifyCompany,PaymentOrderController.get_all_payment_orders);
router.get('/payments/:moduleName/find/one/:paymentId',VerifyCompany,PaymentOrderController.view_a_payment);


//Heads import
//moduleName == headimport
router.post('/import/:moduleName/heads/all',upload.single('csv'),HeadsImportController.import_all_heads);


//counter router
router.get('/counter/get/all',DesignationController.get_all_counters);


//Line Managers
router.get('/line/managers/find/all/:userId',LineManagerController.find_all_line_managers);
router.get('/line/managers/find/settings/:userId',BudgetSettingController.fetch_a_budget_setting,LineManagerController.find_approval_tree,LinerManagers,UsersAtDesignation);

//Budget Transfer Line Managers
router.get('/line/managers/find/settings/budgetTransfer/:userId',BudgetTransferSettingsController.fetch_a_budget_transfer_setting,LineManagerController.find_approval_tree,LinerManagers,UsersAtDesignation);


//Approval Timeline
//moduleName == preApp

router.get('/approvals/:moduleName/timeline/get/:approvalId',moduleName_preApp,VerifyCompany,TimeLineController.view_a_timeline);

//CarryOver ROUTES
//moduleName == carryover
router.post('/budget/carryover/:moduleName/all/heads',moduleName_carryover,CarryOverController.carry_over_all_heads,CarryOverController.create_a_carry_over_log);

//BACKUP routes
// moduleName == backup

router.get('/backup/create/a/backup',BackupController.create_a_backup);
router.get('/backup/download/:backupId',BackupController.download_a_backup);



//Fix mess Routes



//404 Route
router.get('*',NotFoundController.not_found);



module.exports = router;

