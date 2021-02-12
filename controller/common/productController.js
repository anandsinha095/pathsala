import categoryModel from '../../model/product/category'/* inventory */
import productModel from '../../model/product/product'
import { __esModule } from '@babel/register/lib/node';
import { responseHandler } from '../../common/response'
var fs = require('fs');

/****************** category List with size details ************************/
const categoryList = async (req, res) => {
    try {
           let allUserData =  await categoryModel.find({softDelete:0, status:1}).sort({createdAt: -1})
                return responseHandler(res, 200, "OK", allUserData)
        }       
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/******************  Product list  ************************/
const productList = async (req, res) => {
    try {
        let product = await productModel.find({softDelete:0 , isActive:1, status:1}).sort({ createdAt: -1 })
        return responseHandler(res, 200, "Success", product)
    }
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/************************ All Product As Per Category Product ********************/
const allProductAsPerCategory = async (req, res) => {
    const  categoryId  = req.params.categoryId; // destructuring 
    if (!req.params.categoryId) return responseHandler(res, 400, "Bad Request")
    var result =  await productModel.find({ categoryId: categoryId, softDelete:0 , isActive:1, status:1}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
    if (!result) return responseHandler(res, 404, "Category doesn't Exist.")
        try {
            return responseHandler(res, 200, "Success",result)       
        }
        catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/************************ view Product ********************/
const viewProduct = async (req, res) => {
     if (!req.params.productId) return responseHandler(res, 400, "Bad Request")
     const  productId  = req.params.productId; // destructuring 
       var result =  await productModel.findOne({ _id: productId, softDelete:0 , isActive:1, status:1}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
    if (!result) return responseHandler(res, 404, "Product doesn't Exist.")
        try {
            return responseHandler(res, 200, "Success",result)       
        }
        catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }
}

/**************************** Price sorting Product  ************************/
const priceSortingMinMax = async (req, res) => {
    const { min, max, id } = req.params; // destructuring 
    if (!id || !min || !max ) {
        return responseHandler(res, 404, "No product found")
    }
    try{
        let result= await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1, price:{$gte: min, $lt: max}}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0}).sort({price:1})
        return responseHandler(res, 200, "Success", result)             
    }
    
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }  
  }

/**************************** Price sorting Product  ************************/
const priceSortingMin = async (req, res) => {
    const { min, id } = req.params; // destructuring 
    if (!id || !min ) {
        return responseHandler(res, 404, "No product found")
    }
    try{
        let result= await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1, price:{$gte: min}}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0}).sort({price:1})
        return responseHandler(res, 200, "Success", result)             
    }    
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }  
  }

/**************************** discount sorting Product  ************************/
const discountSorting = async (req, res) => {
    const { min, id } = req.params; // destructuring 
    if (!id || !min ) {
        return responseHandler(res, 404, "No product found")
    }
    try{
        let result= await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1, discount:{$gte: min}}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0}).sort({price:1})
        return responseHandler(res, 200, "Success", result)             
    }    
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }  
  }


/****************************  sorting Product high to low & low to high  ************************/
const lownhighSorting = async (req, res) => {
    const { status, id } = req.params; // destructuring 
    if (!id || !status ) {
        return responseHandler(res, 404, "No product found")
    }
    try{
        let result
        if(status == 0)
         result= await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0}).sort({price:1})
        else
        result= await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0}).sort({price:-1})
        return responseHandler(res, 200, "Success", result)             
    }    
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }  
  }

  /****************************  sorting Product high to low & low to high  ************************/
const featuredProductByCategory = async (req, res) => {
    const {id} = req.params; // destructuring 
    if (!id ) {
        return responseHandler(res, 404, "No product found")
    }
    try{
        let result= await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1}, { __v: 0, password: 0, createdAt: 0, updatedAt: 0}).sort({price:1})
        return responseHandler(res, 200, "Success", result)             
    }    
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }  
  }

/****************************  sorting Product high to low & low to high  ************************/
const newArrivalByCategory = async (req, res) => {
    const {id} = req.params; // destructuring 
    if (!id ) {
        return responseHandler(res, 404, "No product found")
    }
    try{
        let result =  await productModel.find({categoryId: id, softDelete:0, isActive:1, status:1, newArrival:1 }, { __v: 0, password: 0, createdAt: 0, updatedAt: 0})
        return responseHandler(res, 200, "Success", result)             
    }    
    catch (e) { return responseHandler(res, 500, "Internal Server Error.", e) }  
  }


module.exports = {
    categoryList:categoryList,
    productList:productList,
    allProductAsPerCategory:allProductAsPerCategory,
    viewProduct:viewProduct,
    priceSortingMinMax:priceSortingMinMax,
    priceSortingMin:priceSortingMin,
    discountSorting:discountSorting,
    lownhighSorting:lownhighSorting,
    newArrivalByCategory:newArrivalByCategory,
    featuredProductByCategory:featuredProductByCategory
};