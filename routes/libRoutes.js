const express = require('express');
const router = express.Router();

const libController = require('../controllers/libController');

router.get('/get-books', libController.getBooks);
router.post('/add-books', libController.postBooks);
router.patch('/edit/:id', libController.returnBooks);


module.exports = router;