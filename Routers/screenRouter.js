const router = require('express').Router();
const {memberDonationDataSavePost} = require('../Controllers/memberDonateController')
const {routeAuth} = require('../helpers/routeAuth')

router.route('/membership-amount-set').post(routeAuth, memberDonationDataSavePost);
router.route('/route-auth').post(routeAuth);
// router.route('/home').get('moto+causes')

module.exports = router;