import userModel from '../../model/user/user'/* for  user */
import roleModel from '../../model/admin/permission'/* inventory */
import { __esModule } from '@babel/register/lib/node';
import { responseHandler } from '../../common/response'
import { bcrypt, bcryptVerify, createJwt, sendMail, verifyJwtToken} from '../../common/function';
import { angular_host, angular_port } from '../../envirnoment/config'
import tokenModel from '../../model/commonModel/token';

/****   Add  role *****/
const addRole = async (req, res) => {
    const { roleName} = req.body; // destructuring 
    if (!roleName ) {
        return responseHandler(res, 400, "Bad request")
    }
    try {
        let info = await verifyJwtToken(req, res)
        req.body.createdBy = info
        let check_role_exist = await roleModel.findOne({roleName: roleName }, { createdAt: 0, updatedAt: 0, __v: 0 })
        if (check_role_exist) return responseHandler(res, 403, "Role already exist")
        await roleModel.create(req.body) /* create user object */
        return responseHandler(res, 200, "Role added successfully")
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}
/****************** role  List  ************************/
const roleList = async (req, res) => {
    try {
        let info = await verifyJwtToken(req, res)
        let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
        if(user == null)
        return responseHandler(res, 400, "Bad Request.")
        else{
            let allRoleList =  await roleModel.find().sort({createdAt: -1})
                return responseHandler(res, 200, "OK", allRoleList)
        }       
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/***************************** Role view **************************/ 
const roleDetail = async (req, res) => {
    if (!req.body.roleId) return responseHandler(res, 400, "Bad Request")
    const roleId = req.body.roleId; // destructuring 
    var result = await roleModel.findById({ _id: roleId }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
    
    if (!result) return responseHandler(res, 404, "User doesn't Exist.")
    try {
        let info = await verifyJwtToken(req, res)
        let user = await userModel.findById({ _id: info }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
        if (!user)
            return responseHandler(res, 400, "Bad Request.")
        else 
            return responseHandler(res, 200, "OK", result)
        }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/****   Update  role *****/
const updateRole = async (req, res) => {
    const { roleName, roleId} = req.body; // destructuring 
    if (!roleName ) {
        return responseHandler(res, 400, "Bad request")
    }
    try {
        let info = await verifyJwtToken(req, res)
        req.body.createdBy = info
        // let check_role_exist = await roleModel.find({roleName: roleName , _id: { $ne: roleId }})
        // if (check_role_exist) return responseHandler(res, 403, "Role already exist")
        let roleData = await roleModel.updateOne({ _id: roleId },{ $set: req.body } );
        return responseHandler(res, 200, "Role updated successfully.")
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

module.exports = {
    addRole: addRole,
    roleList: roleList,
    roleDetail:roleDetail,
    updateRole:updateRole
};