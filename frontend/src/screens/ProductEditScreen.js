import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import {useParams, useNavigate} from 'react-router-dom'
import { USER_UPDATE_RESET } from '../constants/userConstants'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'



// function ProductEditScreen() {

//     const productDetails = useSelector(state => state.productDetails)
//     const {errors, loading, product} = productDetails

//     const productUpdate = useSelector(state => state.productUpdate)
//     const {errors : errorsUpdate, loading: loadingUpdate, success: successUpdate} = productUpdate

//     const dispatch = useDispatch()

//     const [name, setName] = useState('')
//     const [price, setPrice] = useState(0)
//     const [category, setCategory] = useState('')
//     const [brand, setBrand] = useState('')
//     const [image, setImage] = useState('')
//     const [description, setDescription] = useState('')
//     const [countInStock, setCountInStock] = useState(0)
//     const [uploading, setUploading] = useState(false)

//     const navigate = useNavigate()
//     const {id} = useParams()

//     useEffect(() => {
        
//         if (successUpdate){
//             dispatch({type: PRODUCT_UPDATE_RESET})
//             navigate('/admin/productlist')
//         }else{

//             if(!product.name || product._id !== Number(id)){
//                 dispatch(listProductDetails(id))
//             }else{
//                 setName(product.name)
//                 setPrice(product.price)
//                 setCategory(product.category)
//                 setBrand(product.brand)
//                 setCountInStock(product.countInStock)
//                 setDescription(product.description)
//                 setImage(product.image)
//             }
//         }

//      }, [dispatch, product,  id, navigate, successUpdate])


     
// const uploadFileHandler = async (e) => {
//     console.log('file is uploading')
// }

//     const submitHandler = (e) => {
//         e.preventDefault()
//         dispatch(updateProduct(
//             {_id : id,
//             name,
//             price,
//             description,
//             countInStock,
//             image,
//             category,
//             brand}
//         ))
//     }


//   return (
//     <div>
//             <Link to='/admin/productlist'>
//                 Go Back
//             </Link>

//             <FormContainer>
//                 <h1>Edit Product</h1>
//                 {loadingUpdate && <Loader />}
//                 {errorsUpdate && <Message variant='danger'>{errorsUpdate}</Message>}

//                 {loading ? <Loader /> : errors ? <Message variant='danger'>{errors}</Message>
//                     : (
//                         <Form onSubmit={submitHandler}>

//                             <Form.Group controlId='name'>
//                                 <Form.Label>Name</Form.Label>
//                                 <Form.Control

//                                     type='name'
//                                     placeholder='Enter name'
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                 >
//                                 </Form.Control>
//                             </Form.Group>

//                             <Form.Group controlId='price'>
//                                 <Form.Label>Price</Form.Label>
//                                 <Form.Control

//                                     type='number'
//                                     placeholder='Enter price'
//                                     value={price}
//                                     onChange={(e) => setPrice(e.target.value)}
//                                 >
//                                 </Form.Control>
//                             </Form.Group>


//                             <Form.Group controlId='image'>
//                                 <Form.Label>Image</Form.Label>
//                                 <Form.Control

//                                     type='text'
//                                     placeholder='Enter image'
//                                     value={image}
//                                     onChange={(e) => setImage(e.target.value)}
//                                 >
//                                 </Form.Control>

//                                 <Form.File
//                                     id='image-file'
//                                     label='Choose File'
//                                     custom
//                                     onChange={uploadFileHandler}
//                                 >

//                                 </Form.File>
//                                 {uploading && <Loader />}

//                             </Form.Group>


//                             <Form.Group controlId='brand'>
//                                 <Form.Label>Brand</Form.Label>
//                                 <Form.Control

//                                     type='text'
//                                     placeholder='Enter brand'
//                                     value={brand}
//                                     onChange={(e) => setBrand(e.target.value)}
//                                 >
//                                 </Form.Control>
//                             </Form.Group>

//                             <Form.Group controlId='countinstock'>
//                                 <Form.Label>Stock</Form.Label>
//                                 <Form.Control

//                                     type='number'
//                                     placeholder='Enter stock'
//                                     value={countInStock}
//                                     onChange={(e) => setCountInStock(e.target.value)}
//                                 >
//                                 </Form.Control>
//                             </Form.Group>

//                             <Form.Group controlId='category'>
//                                 <Form.Label>Category</Form.Label>
//                                 <Form.Control

//                                     type='text'
//                                     placeholder='Enter category'
//                                     value={category}
//                                     onChange={(e) => setCategory(e.target.value)}
//                                 >
//                                 </Form.Control>
//                             </Form.Group>

//                             <Form.Group controlId='description'>
//                                 <Form.Label>Description</Form.Label>
//                                 <Form.Control

//                                     type='text'
//                                     placeholder='Enter description'
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                 >
//                                 </Form.Control>
//                             </Form.Group>


//                             <Button type='submit' variant='primary'>
//                                 Update
//                         </Button>

//                         </Form>
//                     )}

//             </FormContainer >
//         </div>

//   )
// }

// export default ProductEditScreen


function ProductEditScreen() {

    const navigate= useNavigate()
    const dispatch = useDispatch()
    const {id} = useParams()

    const productDetails = useSelector(state => state.productDetails)
    const {loading: loadingDetails, errors: errorsDetails, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {loading: loadingUpdate, errors: errorsUpdate, success: successUpdate} = productUpdate

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [image, setImage] = useState()
    const [description, setDescription] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [uploading, setUploading] = useState(false)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: id,
            name,
            price,
            category,
            image,
            description,
            brand,
            image
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        
        formData.append('image', file)
        formData.append('product_id', id)

        setUploading(true)

        try{
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const {data} = await axios.post('/api/products/uploadImage/', formData, config)

            setImage(data)
            setUploading(false)
        }
        catch(error){
            setUploading(false)
        }

    }

    useEffect(()=>{
        if(successUpdate){
            dispatch({type: PRODUCT_UPDATE_RESET})
            navigate('/admin/productlist')
        } else{

            if(!product || product._id !== Number(id)){
                dispatch(listProductDetails(id))
            }
            else{
                
                setName(product.name)
                setBrand(product.brand)
                setCategory(product.category)
                setImage(product.image)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                setPrice(product.price)
            }
        }

    }, [dispatch, product,  id, navigate, successUpdate])

  return (
    <div>
        <Link to='/admin/productlist'>Go back</Link>

                     <FormContainer>
                        <h1>Edit Product</h1>
                        <Form onSubmit={submitHandler}>
                            
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={e=>setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='priceq'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={e=>setPrice(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control 
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={e=>setBrand(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control 
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={e=>setCategory(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        {/* <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                type='text'
                                placeholder='Enter image'
                                value={image}
                                onChange={e=>setImage(e.target.value)}
                            >
                            
                            </Form.Control>
                            
                        </Form.Group> */}

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type='text' value={image} onChange={e=>setImage(e.target.value)} ></Form.Control>
                            <Form.Control type="file" placeholder='Enter Image' onChange={uploadFileHandler} />
                        </Form.Group>

                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type='name'
                                placeholder='Enter description'
                                value={description}
                                onChange={e=>setDescription(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock'>
                            <Form.Label>Stock</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Enter Stock'
                                value={countInStock}
                                onChange={e=>setCountInStock(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary'>
                                 Update
                         </Button>

                        </Form>
                     </FormContainer>
    </div>



  )
}

export default ProductEditScreen