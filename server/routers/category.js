const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); 


router.post('/', authMiddleware, adminAuth,  createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id',authMiddleware, adminAuth,  updateCategory);
router.delete('/:id',authMiddleware, adminAuth,  deleteCategory);

module.exports = router;
