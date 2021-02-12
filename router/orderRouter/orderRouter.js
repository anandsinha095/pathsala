const orderRoute= require('express').Router();
import {createOrder, updateOrder, itemList, orderList, orderCustomReport, getSingleOrder,orderReport, userOrderList, commentOrder, allCommentBasedOnOrder, createOrderByAdmin, orderStatusUpdate} from '../../controller/order/orderController';
import { verifyJwt, checkSession } from '../../common/function';

/*********************************** Create New order *************************************************************************/
orderRoute.post('/createOrder',verifyJwt,createOrder);
orderRoute.put('/updateOrder',verifyJwt,updateOrder);
orderRoute.get('/orderList',verifyJwt,orderList);
orderRoute.get('/userOrderList',verifyJwt,userOrderList);
orderRoute.post('/getSingleOrder',verifyJwt,getSingleOrder);
orderRoute.post('/commentOrder',verifyJwt,commentOrder);
orderRoute.post('/allCommentBasedOnOrder',verifyJwt,allCommentBasedOnOrder);
orderRoute.post('/createOrderByAdmin',verifyJwt,createOrderByAdmin);
orderRoute.put('/orderStatusUpdate',verifyJwt,orderStatusUpdate);
orderRoute.get('/itemList',verifyJwt,itemList);
orderRoute.post('/orderReport',verifyJwt,orderReport);
orderRoute.post('/orderCustomReport',verifyJwt,orderCustomReport);
export default orderRoute;
