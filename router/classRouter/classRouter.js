const classesRoute= require('express').Router();
import {addClass, classList} from '../../controller/classes/classController';
import { verifyJwt, checkSession } from '../../common/function';


classesRoute.post('/addClass', verifyJwt, addClass);
classesRoute.get('/classList', verifyJwt, classList);


export default classesRoute;
