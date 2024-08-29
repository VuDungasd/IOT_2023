const express = require('express');
const APIController = require('../controller/APIController');

let router = express.Router()

const initAPIRoute = (app) => {
    router.get('/users', APIController.getAllUsers);
    router.get('/test', APIController.getAll);


    return app.use('/api/v1', router);
}
module.exports = initAPIRoute;
// export default initAPIRoute 
/*
    Node.js phiên bản cũ (< v13): Mặc định sẽ sử dụng CommonJS (require/module.exports).
Node.js phiên bản mới hơn (>= v13): Mặc định sẽ sử dụng ES Modules (import/export).
*/ 