const publicRoute= require('express').Router();
import {categoryList, productList, allProductAsPerCategory , viewProduct, priceSortingMinMax, priceSortingMin ,discountSorting, lownhighSorting, newArrivalByCategory, featuredProductByCategory} from '../../controller/common/productController'
import {featuredProduct, homePageBanners, newArrivalProduct} from '../../controller/homePage/homepageController'
publicRoute.get('/categoryList', categoryList);
publicRoute.get('/productList', productList);
publicRoute.get('/viewProduct/:productId', viewProduct);
publicRoute.get('/allProductAsPerCategory/:categoryId', allProductAsPerCategory);
publicRoute.get('/featuredProduct', featuredProduct); 
publicRoute.get('/homePageBanners', homePageBanners); 
publicRoute.get('/newArrivalProduct', newArrivalProduct); 
publicRoute.get('/priceSortingMinMax/:id/:min/:max/', priceSortingMinMax); 
publicRoute.get('/priceSortingMin/:id/:min/', priceSortingMin);
publicRoute.get('/discountSorting/:id/:min/', discountSorting); 
publicRoute.get('/lownhighSorting/:id/:status/', lownhighSorting); 
publicRoute.get('/newArrivalByCategory/:id/', newArrivalByCategory); 
publicRoute.get('/featuredProductByCategory/:id/', featuredProductByCategory); 
export default publicRoute;