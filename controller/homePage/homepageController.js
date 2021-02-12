import { __esModule } from '@babel/register/lib/node';
import { responseHandler } from '../../common/response'
import { bcrypt, bcryptVerify, createJwt, sendMail, verifyJwtToken, tenMinutesJwt} from '../../common/function';
import productModel from '../../model/product/product'
import bannerModel from '../../model/home/banner'

/***************************Display All home page banner  *******************/
const homePageBanners = async (req, res) => {     
    try {
        var result =  await bannerModel.find({status:1}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        if(!result[0]){
         return responseHandler(res, 404, "No Banner found")   
        }          
        else
        return responseHandler(res, 200, "Success", result)       
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}
 

/************************ Featured Product ********************/
const featuredProduct = async (req, res) => {     
       try {
          var result =  await productModel.find({softDelete:0, featured:1 }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        //    if(!result[0]){
        //     return responseHandler(res, 404, "No featured product found")   
        //    }          
        //    else
           return responseHandler(res, 200, "Success", result)       
       }
       catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}


/************************ New Arrival Product ********************/
const newArrivalProduct = async (req, res) => {     
    try {
        var result =  await productModel.find({softDelete:0, newArrival:1 }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        // if(!result[0]){
        //  return responseHandler(res, 404, "No new arrival product found")   
        // }          
        // else
        return responseHandler(res, 200, "Success", result)       
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

module.exports = {
    homePageBanners:homePageBanners,
    featuredProduct:featuredProduct,
    newArrivalProduct:newArrivalProduct
};