import vendorModel from '../../model/vendor/vendor'/* To Create user */
import userModel from '../../model/user/user' /* To Create user */
import { __esModule } from '@babel/register/lib/node';
import { responseHandler } from '../../common/response'
import { bcrypt, bcryptVerify, createJwt, sendMail, verifyJwtToken} from '../../common/function';
import tokenModel from '../../model/commonModel/token';
import multiparty from 'multiparty';
import csc from 'country-state-city'
import { host, angular_port } from '../../envirnoment/config';
var randomstring = require("randomstring");
var fs = require('fs');
    /* get all vendor data */
const getAllvendor = async (req, res) => {
    try {
        let info = await verifyJwtToken(req, res)
        let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        if(user == null)
        return responseHandler(res, 400, "Bad Request.")
        else{
            let allUserData =  await vendorModel.find().sort({createdAt: -1})
                return responseHandler(res, 200, "OK", allUserData)
        }       
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}
const createVendor = async (req, res) => {
const {firstName, lastName,  email,  phoneNumber, storeName, addressOne, addressTwo, countryId, stateId, cityId, zipcode } = req.body // destructuring
  if ( !firstName || !lastName || !email ||  !phoneNumber  ) {
    return responseHandler(res, 400, "Bad request")
  }
  try {
    let check_email_exist = await vendorModel.findOne({ email: email })
    if (check_email_exist) {
      return responseHandler(res, 400, "Bad request")
    }
    let plainPassword = randomstring.generate({
      length: 8,
      charset: 'alphanumeric'
    })
 
    req.body.password = await bcrypt(plainPassword)
    let lastUser=  await vendorModel.find({}).sort({_id:-1}).limit(1)
    req.body.userId =  lastUser[0] !=undefined  ? parseFloat(lastUser[0].userId) + 1 : 1001;
    let result = await vendorModel.create(req.body) /* create user object */
    let token = await createJwt({ userId: result._id }) /* generate jwt */
    /* mail sending process */
    let link ='<html> <body> <div bgcolor="#f3f3f3" style="background-color:#f3f3f3"> <table width="650" bgcolor="#ffffff" border="0" align="center" cellpadding="0" cellspacing="0" style="color:#000;font-family:Lato,Helvetica Neue,Helvetica,Arial,sans-serif;"> <tbody> <tr> <td height="30" bgcolor="#f3f3f3"></td></tr><tr> <td height="102" align="center" style="border-bottom:1px solid #eaeaea;"> <img src="http://'+host +'/global_assets/images/logo.png" style="width:65px" alt="Caremx" class="CToWUd"> </td></tr><tr> <td valign="top"> <table width="100%" border="0" cellpadding="30" cellspacing="0" style="font-size:14px"> <tbody> <tr> <td> <div> <p style="font-size:16px">Dear Customer,</p><div style="color:#333;font-size:14px"> <p> Email: ' +req.body.email +' </p></p>Password: ' +plainPassword +' </p><p> Click <a href="http://' + host +'/verify/' +token +'">here</a> to verify your account</p> <p>Mail : info@caremx.com.</p><p>The CareMX Team </p></div></div></td></tr></tbody> </table> </td></tr><tr> <td height="40" align="center" valign="bottom" style="font-size:12px;color:#999"> © 2020 Caremx. All Rights Reserved. </td></tr><tr> <td height="30"></td></tr><tr> <td height="30" bgcolor="#f3f3f3"></td></tr></tbody> </table> </div></body></html>'
    sendMail(email, '[Caremx] Confirm Your Registration From ' + ' ' + new Date() + '', '', link) /* verification mail send */
    await tokenModel.create({ userId: result._id, token: token,   type: 'EMAILV' }) /* Save Token to user Corresponding  */
    return responseHandler(res, 200, "You have successfully registered. Please Verify your email")
  } 
  catch (e) {
    console.log("Error :=>", e)
    return responseHandler(res, 500, e)
  }
}
/* Get view details of a Employee  Info */    
const vendorDetail = async (req, res) => {
  if (!req.body.userId) return responseHandler(res, 400, "Bad Request")
  const  userId  = req.body.userId; // destructuring 
  var result =  await vendorModel.findById({ _id: userId }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
  if (!result) return responseHandler(res, 404, "User doesn't Exist.")
  if (result.roleId ==3 ) return responseHandler(res, 404, "User doesn't Exist.")
  try {
      let info = await verifyJwtToken(req, res)
      let user = await vendorModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
      let obj = { country: csc.getCountryById(result.countryId.toString()).name, state: csc.getStateById(result.stateId.toString()).name, city: csc.getCityById(result.cityId.toString()).name }
      let finalResponse = { result: result, csc: obj }
      return responseHandler(res, 200, finalResponse)       
  }
  catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/* update vendor profile  */
const updateVendor = async (req, res) => {
  var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        const { firstName, lastName, phoneNumber, userId, storeName, addressOne, addressTwo, countryId, stateId, cityId, zipcode, status } = req.body; // destructuring 
        if (!firstName || !lastName  || !userId || !addressOne || !storeName ||  !countryId || !stateId || !cityId || !zipcode || !status) {
            return responseHandler(res, 400, "Bad request")
        }
        try {
            let user_id= await verifyJwtToken(req, res)
            let user_obj = await userModel.findOne({ _id: user_id })
            if(!user_obj) return responseHandler(res, 400, "Bad request")
            let customerData = await vendorModel.findOne({ _id: userId })            
            if(req.file == undefined && customerData.profilePicture !=undefined){
                req.body.profilePicture = customerData.profilePicture
            }
            else if(req.file != undefined){
                let imagePath = req.file.path+'.'+req.file.originalname.split('.')[1];              
                fs.rename( req.file.path , req.file.path + '.'+req.file.originalname.split('.')[1], function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
                req.body.profilePicture = imagePath.replace("public/","");
            }   
                await vendorModel.updateOne({ _id: userId }, { $set: { firstName: firstName, lastName:lastName, phoneNumber: phoneNumber, profilePicture: req.body.profilePicture, storeName:storeName, addressOne:addressOne, addressTwo:addressTwo, zipcode:zipcode, countryId:countryId, stateId:stateId, cityId:cityId, status: status} }) //update the password with new one
                return responseHandler(res, 200, "Profile updated successfully.")
        }
        catch (e) {
            console.log("Error ===>", e)
            return responseHandler(res, 500, e)
        }
    })
}
const vendor_isActive = async (req, res) => {
  const { userId } = req.body; // destructuring 
  if (!userId) {
      return responseHandler(res, 400, "Bad request")
  }
  var result =  await vendorModel.find({ userId: userId }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
  if (!result) return responseHandler(res, 404, "Vendor doesn't Exist.")
  try {
      let info = await verifyJwtToken(req, res)
      let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
      if(!user)
      return responseHandler(res, 400, "Bad request")
      let mainUser = await vendorModel.findOneAndUpdate({ userId: userId }, {status: result[0].status==1? 0 : 1})
      if(mainUser.status == 0){
      let link = '<html> <body> <div bgcolor="#f3f3f3" style="background-color:#f3f3f3"> <table width="650" bgcolor="#ffffff" border="0" align="center" cellpadding="0" cellspacing="0" style="color:#000;font-family:Lato,Helvetica Neue,Helvetica,Arial,sans-serif;"> <tbody> <tr> <td height="30" bgcolor="#f3f3f3"></td></tr><tr> <td height="102" align="center" style="border-bottom:1px solid #eaeaea;"> <img src="http://'+host+'/global_assets/images/logo.png" style="width:65px" alt="Caremx" class="CToWUd"> </td></tr><tr> <td valign="top"> <table width="100%" border="0" cellpadding="30" cellspacing="0" style="font-size:14px"> <tbody> <tr> <td> <div> <p style="font-size:16px">Dear '+mainUser.firstName+' '+ mainUser.lastName+' ,</p><div style="color:#333;font-size:14px"> <p style="color:#333">You account is blocked ! Please contact to admin </p><p>Mail : info@caremx.com.</p><p>The Caremx Team </p></div></div></td></tr></tbody> </table> </td></tr><tr> <td height="40" align="center" valign="bottom" style="font-size:12px;color:#999"> © 2020 Caremx. All Rights Reserved. </td></tr><tr> <td height="30"></td></tr><tr> <td height="30" bgcolor="#f3f3f3"></td></tr></tbody> </table> </div></body></html>'
      sendMail(mainUser.email, "Your Caremx account status updated", null, link)
          }
      else if(mainUser.status == 1){
      let link = '<html> <body> <div bgcolor="#f3f3f3" style="background-color:#f3f3f3"> <table width="650" bgcolor="#ffffff" border="0" align="center" cellpadding="0" cellspacing="0" style="color:#000;font-family:Lato,Helvetica Neue,Helvetica,Arial,sans-serif;"> <tbody> <tr> <td height="30" bgcolor="#f3f3f3"></td></tr><tr> <td height="102" align="center" style="border-bottom:1px solid #eaeaea;"> <img src="http://'+host+'/global_assets/images/logo.png" style="width:65px" alt="Caremx" class="CToWUd"> </td></tr><tr> <td valign="top"> <table width="100%" border="0" cellpadding="30" cellspacing="0" style="font-size:14px"> <tbody> <tr> <td> <div> <p style="font-size:16px">Dear '+mainUser.firstName+' '+ mainUser.lastName+',</p><div style="color:#333;font-size:14px"> <p style="color:#333">You account is Unblocked ! </p><p>Mail : info@caremx.com.</p><p>The Caremx Team </p></div></div></td></tr></tbody> </table> </td></tr><tr> <td height="40" align="center" valign="bottom" style="font-size:12px;color:#999"> © 2020 Caremx. All Rights Reserved. </td></tr><tr> <td height="30"></td></tr><tr> <td height="30" bgcolor="#f3f3f3"></td></tr></tbody> </table> </div></body></html>'
      sendMail(mainUser.email, "Your Caremx account status updated", null, link)        
      }
      return responseHandler(res, 200, "OK")           
  }
  catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}
const deleteVendor = async (req, res) => {
  const { userId } = req.body; // destructuring 
  if (!userId) {
      return responseHandler(res, 400, "Bad request")
  }
  var result =  await vendorModel.find({ userId: userId }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
  if (!result) return responseHandler(res, 404, "Vendor doesn't Exist.")
  try {
      let info = await verifyJwtToken(req, res)
      let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
      if(!user)
      return responseHandler(res, 400, "Bad request")
      else{
          let mainUser = await vendorModel.findOneAndUpdate({ userId: userId }, {softDelete:1})
          let link = '<html> <body> <div bgcolor="#f3f3f3" style="background-color:#f3f3f3"> <table width="650" bgcolor="#ffffff" border="0" align="center" cellpadding="0" cellspacing="0" style="color:#000;font-family:Lato,Helvetica Neue,Helvetica,Arial,sans-serif;"> <tbody> <tr> <td height="30" bgcolor="#f3f3f3"></td></tr><tr> <td height="102" align="center" style="border-bottom:1px solid #eaeaea;"> <img src="http://'+host+'/global_assets/images/logo.png" style="width:65px" alt="Caremx" class="CToWUd"> </td></tr><tr> <td valign="top"> <table width="100%" border="0" cellpadding="30" cellspacing="0" style="font-size:14px"> <tbody> <tr> <td> <div> <p style="font-size:16px">Dear '+mainUser.firstName+' '+ mainUser.lastName+' ,</p><div style="color:#333;font-size:14px"> <p style="color:#333">You account is Suspended ! Please contact to admin </p><p>Mail : info@caremx.com.</p><p>The Caremx Team </p></div></div></td></tr></tbody> </table> </td></tr><tr> <td height="40" align="center" valign="bottom" style="font-size:12px;color:#999"> © 2020 Caremx. All Rights Reserved. </td></tr><tr> <td height="30"></td></tr><tr> <td height="30" bgcolor="#f3f3f3"></td></tr></tbody> </table> </div></body></html>'
          sendMail(mainUser.email, "Your Caremx account Suspended", null, link)
          return responseHandler(res, 200, "OK")  
      }               
  }
  catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }

}
module.exports = {
    getAllvendor:getAllvendor,
    createVendor:createVendor,
    vendorDetail:vendorDetail,
    vendorIsActive:vendor_isActive,
    deleteVendor:deleteVendor,
    updateVendor:updateVendor,
    
}