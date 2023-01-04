const express = require('express')
const router = express.Router()
const {requireLogin} = require('../middleware/authMiddleware')
const addressController = require('../controllers/addressController')

router.post('/', requireLogin, addressController.addNewAddress)
router.get('/', requireLogin, addressController.getAllAddresses)
router.get('/:id', requireLogin, addressController.getOneAddress)
router.put('/:id', requireLogin, addressController.updateAddress)
router.delete('/:id', requireLogin, addressController.deleteAddress)


module.exports = router