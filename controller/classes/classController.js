import classesModel from '../../model/classes/classes'/* To Create user */
import userModel from '../../model/user/user'/* To Create user */
import { __esModule } from '@babel/register/lib/node';
import { responseHandler } from '../../common/response'
import { bcrypt, bcryptVerify, createJwt, sendMail, verifyJwtToken} from '../../common/function';

const addClass = async (req, res) => {
    const {name , steats, subject}= req.body
    if(!name || !subject)
     return responseHandler(res, 400, "Bad Request.")
    try {
        let info = await verifyJwtToken(req, res)
        let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        if(user == null)
        return responseHandler(res, 400, "Bad Request.")
        let classDetails = await classesModel.findOne({ name: name }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        if(classDetails)
        return responseHandler(res, 406, "Class already Exist")
        else
        {
             req.body.createdBy=info
             await classesModel.create(req.body) 
             return responseHandler(res, 200, "Class add successfully")
        }
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/*******************Class List  **************/
    const classList = async (req, res) => {
        try {
            let info = await verifyJwtToken(req, res)
            let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
            if(!user) return responseHandler(res, 400, "Bad Request.")
            else{
                let result =  await classesModel.find({ status: 1}).sort({createdAt: -1})
                    return responseHandler(res, 200, "OK", result)
            }       
        }
        catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
    } 

module.exports = {
    addClass: addClass,
    classList:classList
}
