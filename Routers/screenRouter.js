const router = require('express').Router();
const {memberDonationDataSavePost} = require('../Controllers/memberDonateController')
const {routeAuth} = require('../helpers/routeAuth')

router.route('/membership-donation').post(routeAuth, memberDonationDataSavePost);
// router.route('/profile').get(routeAuth, 'transactionHistory');
// router.route('/home').get('moto+causes')

module.exports = router;