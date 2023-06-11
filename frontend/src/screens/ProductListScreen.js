import React, {useEffect} from 'react'
import {Table, Button, Row, Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts, deleteProduct, createProduct, listProductDetails } from '../actions/productActions'
import { useNavigate, useLocation } from 'react-router-dom'
import {  PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'

function ProductListScreen() {

    

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const keyword = location.search

    const productList = useSelector(state => state.productList)
    const {loading, error, products, page, pages} = productList

    const productDelete = useSelector(state => state.productDelete)
    const {loading: loadingDelete, error: errorDelete, success: successDelete} = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const {loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct} = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if( userInfo && userInfo.isAdmin){

            dispatch(listProducts())
        }else{
            navigate('/login')
        }

        dispatch({type: PRODUCT_CREATE_RESET})

        if(!userInfo.isAdmin){
            navigate('/login')
        }

        if(successCreate){
            navigate(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch(listProducts(keyword))
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, keyword])

    const deleteHandler = (id) => {
            if(window.confirm('Are you sure you want to delete this product?')){
                dispatch(deleteProduct(id))
            }
        
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

  return (
    <div>
        <Row className='align-items-center' >
            <Col>
                <h1>Products</h1>
            </Col>
            <Col>
                <Button className='my-3' onClick={createProductHandler} ><i className='fas fa-plus' > </i>Create Product</Button>
            </Col>
        </Row>
        {loadingDelete && <Loader/>}
        {errorDelete && <Message variant='danger' >{errorDelete}</Message>}

        {loadingCreate && <Loader/>}
        {errorCreate && <Message variant='danger' >{errorCreate}</Message>}

        {loading ? <Loader/> : 
         error ? <Message variant='danger' >{error}</Message> : 
         (
            <Table striped responsive bordered hover className='table-sm' >
                <thead>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>BRAND</th>
                    <th></th>
                </thead>

                <tbody>
                    {products.map(product => (
                        <tr key={product._id} >
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>

                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`} >
                                    <Button variant='light' className='btn-sm' onClick={() => dispatch(listProductDetails(product._id))} >
                                        <i className='fas fa-edit' ></i>
                                    </Button>
                                </LinkContainer>

                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)} >
                                        <i className='fas fa-trash' ></i>
                                </Button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
         )}
         <Paginate page={page} pages = {pages} isAdmin={true} />
    </div>
  )
}

export default ProductListScreen