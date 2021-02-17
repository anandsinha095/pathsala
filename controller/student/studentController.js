import studentModel from '../../model/student/students'/* To Create user */
import classesModel from '../../model/classes/classes'/* To Create user */
import userModel from '../../model/user/user'/* To Create user */
import { __esModule } from '@babel/register/lib/node';
import { responseHandler } from '../../common/response'
import { bcrypt, bcryptVerify, createJwt, sendMail, verifyJwtToken} from '../../common/function';
import tokenModel from '../../model/commonModel/token';
import multiparty from 'multiparty';
import csc from 'country-state-city'
import { host, angular_port } from '../../envirnoment/config';
var randomstring = require("randomstring");
var fs = require('fs');


const signUp = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, alternetPhoneNumber, dob, gender, classId, fatherFirstName, fatherLastName, montherFirstName, montherLastName, fatherOccupation, motherOccupation, addressOne, addressTwo, city, zipcode} = req.body; // destructuring 
    if (!firstName || !lastName || !email || !phoneNumber || !dob || !gender || !classId  || !fatherFirstName || !fatherLastName || !montherFirstName  || !montherLastName || !fatherOccupation || !addressOne || !city || !zipcode){ 
        return responseHandler(res, 400, "Bad request")
    }
    try {
        let info = await verifyJwtToken(req, res)
        let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        if(!user) return responseHandler(res, 400, "Bad Request.")
        let check_student_exist = await studentModel.findOne({ firstName: firstName, lastName:lastName, fatherFirstName:fatherFirstName, fatherLastName:fatherLastName})
        if (check_student_exist) return responseHandler(res, 403, "Student already exist")
        /* 1: Admin // 2: Employee // 3:Customer //4: production head*/
        let plainPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        });
        req.body.password =await bcrypt(plainPassword) 
        req.body.isActive = user.roleId == 1 ? true : false  
        req.body.emailVerified = true;
        let lastUser=  await studentModel.find({}).sort({_id:-1}).limit(1)
        req.body.userId = lastUser.length > 0 ? parseFloat(lastUser[0].userId) + 1 : 1001;
        req.body.username = "Era-2021-"+req.body.userId
        let result = await studentModel.create(req.body) /* create user object */
        let token = await createJwt({ userId: result._id}) /* generate jwt */
        /* mail sending process */
       let link = '<html> <body> <div bgcolor="#f3f3f3" style="background-color:#f3f3f3"> <table width="650" bgcolor="#ffffff" border="0" align="center" cellpadding="0" cellspacing="0" style="color:#000;font-family:Lato,Helvetica Neue,Helvetica,Arial,sans-serif;"> <tbody> <tr> <td height="30" bgcolor="#f3f3f3"></td></tr><tr> <td height="102" align="center" style="border-bottom:1px solid #eaeaea;"> <img src="http://'+host+'/assets/img/logo1.png" style="width:65px" alt="Golden Era English School" class="CToWUd"> </td></tr><tr> <td valign="top"> <table width="100%" border="0" cellpadding="30" cellspacing="0" style="font-size:14px"> <tbody> <tr> <td> <div> <p style="font-size:16px">Dear Concern,</p><div style="color:#333;font-size:14px"><p>Your account is created with Golden Era English School. Use below credential to login. </p><p>Link: '+host+ '<p>Student First Name: '+ req.body.firstName +'</p><p>Student Last Name: '+ req.body.lastName +'</p></p> <p>Username: '+ req.body.username +'</p><p>Password: '+ plainPassword +'</p><p>Mail : info@goldeneraenglishschool.com.</p><p>The Golden Era English School Team </p></div></div></td></tr></tbody> </table> </td></tr><tr> <td height="40" align="center" valign="bottom" style="font-size:12px;color:#999"> © 202 Golden Era English School. All Rights Reserved. </td></tr><tr> <td height="30"></td></tr><tr> <td height="30" bgcolor="#f3f3f3"></td></tr></tbody> </table> </div></body></html>'
        sendMail("geesbarbigha@gmail.com", "[Golden Era English School] New student registered at " + " " + new Date() + "", "", link) /* verification mail send */
        return responseHandler(res, 200, "Student successfully registered.")
    }
    catch (e) {
        console.log("Error :=>", e)
        return responseHandler(res, 500, e)
    }
}

/**************************Studennt details  ***********************/
const studentInfo = async (req, res) => {    
    if (!req.params.id) return responseHandler(res, 400, "Bad Request")
    let info = await verifyJwtToken(req, res)
    let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
    if(!user)return responseHandler(res, 400, "Bad Request")
    const  userId  = req.params.id; // destructuring 
    var result =  await studentModel.findById({ _id: userId }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
    if (!result) return responseHandler(res, 404, "Student doesn't Exist.")
    try {
        return responseHandler(res, 200, 'Success',result)       
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}


/********************Student List  ***********************/
const studentList = async (req, res) => {

    try {
        let info = await verifyJwtToken(req, res)
        let classes =  await classesModel.find({ status: 1}).sort({createdAt:1})
        let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        if(!user) return responseHandler(res, 400, "Bad Request.")
        else{
            let students =[];
            let result =  await studentModel.find().sort({createdAt: -1})
            result.forEach(async result => {
                classes.forEach(async ele =>{
                    if(ele._id.toString() == result.classId.toString()){
                        students.push({ result: result, classes: ele.name })
                    }
                   
                })           
             })
            return responseHandler(res, 200, "OK", students)
        }       
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
} 

module.exports = {
    signUp: signUp,
    //signIn:signIn
    studentInfo:studentInfo,
    studentList:studentList
}