import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useNavigate } from 'react-router-dom'
// import products from '../products'
// products.js was deleted not req after backend next to index.js in frontend 
// import axios from 'axios'
import { listProductDetails, createProductReview } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = ({ match }) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [product, setProduct] = useState({})
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product} = productDetails

    const productCreateReview = useSelector(state => state.productCreateReview)
    const { success: successProductReview, error: errorProductReview} = productCreateReview

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const { id } =useParams()
    useEffect(()=>{
        // const fetchData = async () =>{
        //     const res = await axios.get(`/api/products/${id}`)
        //     setProduct(res.data)
        // }

        // fetchData()
        if(successProductReview){
            alert('Review Submitted!')
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        dispatch(listProductDetails(id))

    },[dispatch, id, successProductReview])
    const addToCartHandler = () =>{
        navigate(`/cart/${id}?qty=${qty}`)
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(createProductReview(id, {
            rating,
            comment,
        }))
    }
    // const product = products.find(p => p._id === id)
  return (
    <>
        <Link className='btn btn-light my-3' to='/'>Go Back</Link>
        {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : 
        (<><Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid/>
            </Col>
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>{product.name}</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div style={{fontWeight:"bold", fontSize:'1.5rem'}} className='my-4'>Price: ${product.price}</div>
                        <div>Description: {product.description}</div>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col style={{fontWeight:"bold"}}>
                                    Price:
                                </Col>
                                <Col>
                                    <strong style={{fontWeight:"bold"}}>${product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col style={{fontWeight:"bold"}}>
                                    Status:
                                </Col>
                                <Col style={{fontWeight:"bold"}}>
                                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        {product.countInStock>0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>Qty</Col>
                                    <Col>
                                        <Form.Control as='select' value={qty} onChange={(e)=>
                                        setQty(e.target.value)
                                        }>
                                            {[...Array(product.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x+1}>{x+1}</option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                            <Button onClick={addToCartHandler} style={{width:'100%'}} className='btn-block' type='button' disabled={product.countInStock===0}>ADD TO CART</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant='flush'>
                    {product.reviews.map(review=>(
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating}/>
                            {/* <p>{review.createdAt.substring(0, 10)}</p> */}
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                        <h2>Write a customer review</h2>
                        {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                        {userInfo ? (<Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control as='select' value={rating} onChange={(e)=>
                                setRating(e.target.value)}>
                                    <option value=''>Select...</option>
                                    <option value='1'>1-Poor</option>
                                    <option value='2'>2-Fair</option>
                                    <option value='3'>3-Good</option>
                                    <option value='4'>4-Very Good</option>
                                    <option value='5'>5-Excellent</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='comment'>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as='textarea' row='3' value={comment}
                                onChange={(e)=>setComment(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button className='my-3' type='submit' variant='primary'>
                                Submit
                            </Button>
                        </Form>) : <Message>Please <Link to='/login'>Sign In</Link> to write a review</Message>}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
        </>
        )}
    </>
  )
}

export default ProductScreen