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
    const { firstName, lastName, email, phoneNumber, dob, gender,  roleId,  addressOne, addressTwo, country, state, city, zipcode, organization} = req.body; // destructuring 
    if (!firstName || !lastName || !email || !phoneNumber || !dob || !gender || !roleId  ||  !addressOne || !country || !state || !city || !zipcode || !organization){ 
        return responseHandler(res, 400, "Bad request")
    }
    try {
        let check_email_exist = await userModel.findOne({ email: email })
        if (check_email_exist) return responseHandler(res, 403, "email already exist")
         /* 1: Admin // 2: Employee // 3:Customer //4: production head*/
        let plainPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        });
        req.body.password =await bcrypt(plainPassword) 
        req.body.status = true;
        req.body.emailVerified = true;
        let lastUser=  await userModel.find({}).sort({_id:-1}).limit(1)
        req.body.userId = lastUser.length > 0 ? parseFloat(lastUser[0].userId) + 1 : 1001;
        let result = await userModel.create(req.body) /* create user object */
        let token = await createJwt({ userId: result._id}) /* generate jwt */
        /* mail sending process */
        let link = '<html> <body> <div bgcolor="#f3f3f3" style="background-color:#f3f3f3"> <table width="650" bgcolor="#ffffff" border="0" align="center" cellpadding="0" cellspacing="0" style="color:#000;font-family:Lato,Helvetica Neue,Helvetica,Arial,sans-serif;"> <tbody> <tr> <td height="30" bgcolor="#f3f3f3"></td></tr><tr> <td height="102" align="center" style="border-bottom:1px solid #eaeaea;"> <img src="http://'+host+'/global_assets/images/logo.png" style="width:65px" alt="Pathsala" class="CToWUd"> </td></tr><tr> <td valign="top"> <table width="100%" border="0" cellpadding="30" cellspacing="0" style="font-size:14px"> <tbody> <tr> <td> <div> <p style="font-size:16px">Dear Customer,</p><div style="color:#333;font-size:14px"> <p> Email: '+ req.body.email+' </p></p>Password: '+ plainPassword +' </p><p> Click <a href="http://'+host+'/verify/'+token +'">here</a> to verify your account</p> <p>Mail : info@Pathsala.com.</p><p>The Pathsala Team </p></div></div></td></tr></tbody> </table> </td></tr><tr> <td height="40" align="center" valign="bottom" style="font-size:12px;color:#999"> © 2020 Pathsala. All Rights Reserved. </td></tr><tr> <td height="30"></td></tr><tr> <td height="30" bgcolor="#f3f3f3"></td></tr></tbody> </table> </div></body></html>' 
        sendMail(email, "[Pathsala] Confirm Your Registration From " + " " + new Date() + "", "", link) /* verification mail send */
        await tokenModel.create({ userId: result._id, token: token, type: "EMAILV"})/* Save Token to user Corresponding  */
        return responseHandler(res, 200, "New Customer successfully registered.")
    }
    catch (e) {
        console.log("Error :=>", e)
        return responseHandler(res, 500, e)
    }
}

const signIn = async (req, res) => {
    if (!req.body.email || !req.body.password) return responseHandler(res, 400, "Bad Request")
    try {
        var result = await userModel.findOne({ email: req.body.email }, { createdAt: 0, updatedAt: 0, __v: 0 })
        if (!result) return responseHandler(res, 404, "User doesn't Exist.")
        let verified = await bcryptVerify(req.body.password, result.password)
        if (verified == false) return responseHandler(res, 404, "Invalid Password")
        else if(result.status == false) return responseHandler(res, 407, "Your account is blocked ! Contact to Admin")
        else if (result.emailVerified == false) {
            /* Check What Type of Link Send To user  */
            await sendMailForEmailVerification(result.email, result._id, res)
            return responseHandler(res, 461, "Please Verify Your Mail.", { _id: result._id, email: result.email })
        }
        else if (verified == true && result.status == true){            
            let finalResponse =  { result: result}          
             let token = await createJwt(result._id)    
             finalResponse.jwt = token  
             return responseHandler(res, 200, "OK", finalResponse)
        }
    }
    catch (e) {
        console.log("error =>", e)
        return responseHandler(res, 500, e)
    }
}



module.exports = {
    signUp: signUp,
    signIn:signIn
}