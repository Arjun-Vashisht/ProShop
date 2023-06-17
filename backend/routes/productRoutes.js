import express from 'express'
import { getProductById, getProducts, deleteProduct, updateProduct, createProduct,
createProductReview, getTopProducts } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router()
// import asyncHandler from 'express-async-handler'
// import Product from '../models/productModel.js'
//@desc fetch all products
//@route GET /api/products
//@access public
// router.get('/', asyncHandler(async (req, res)=>{
//     const products = await Product.find({})
    
//     res.json(products)
// }))
router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect,createProductReview)
router.get('/top', getTopProducts)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect,
    admin, updateProduct)
//@desc fetch all product
//@route GET /api/products/:id 
//@access public

// router.get('/:id',asyncHandler(async (req, res)=>{
//     const product = await Product.findById(req.params.id) 
//     if(product){
//         res.json(product)   
//     } else {
//         // res.status(404).json({ message: 'Product not found' })
//         res.status(404)
//         throw new Error('Product not Found!')

//     }
// }))

export default router