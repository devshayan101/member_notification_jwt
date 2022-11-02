const router = require('express').Router();
const { verifyAccessToken } = require('../helpers/jwt_helper');
const {test} = require('../Controllers/contributionController')
const {routeAuth} = require('../helpers/routeAuth')

router.route('/donations').get(routeAuth, test);


module.exports = router;