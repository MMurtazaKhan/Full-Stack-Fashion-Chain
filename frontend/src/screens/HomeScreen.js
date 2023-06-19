// import React, { useEffect} from 'react'
// import {Row, Col} from "react-bootstrap"
// import Product from '../components/Product'
// // import products from '../products'
// import { useDispatch, useSelector } from 'react-redux'
// import {listProducts} from '../actions/productActions'
// import { useLocation } from 'react-router-dom'
// import Loader from '../components/Loader'
// import Message from '../components/Message'
// import Paginate from '../components/Paginate'
// import ProductCarousel from './ProductCarousel'

// function HomeScreen() {

//   const location = useLocation()
//   // const [products, setProducts] = useState([])
//   const dispatch = useDispatch()
//   const productList = useSelector(state=>state.productList)
//   const {errors, loading, products, page, pages} = productList
  
//   let keyword = location.search
//   console.log(keyword)

//   useEffect(()=>{
//     dispatch(listProducts(keyword))
//   }, [dispatch, keyword])
//   return (
//     <div>
//       {!keyword && <ProductCarousel />}
//         <h1>Latest Products</h1>
//         {loading ? <Loader/>
//         : errors ? <Message variant='danger'>{errors}</Message>
//        : <Row>
//        {products.map(product=>(
//            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
//                <Product product={product} />
//            </Col>
//        ))}
//    </Row>}
        
//         <Paginate page={page} pages ={pages} keyword={keyword} />
//     </div>
//   )
// }

// export default HomeScreen


import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from './ProductCarousel'
import { listProducts } from '../actions/productActions'
import { useLocation } from 'react-router-dom'


function HomeScreen({ history }) {
    const dispatch = useDispatch()
    const location = useLocation()
    const productList = useSelector(state => state.productList)
    const { error, loading, products, page, pages } = productList

    let keyword = location.search

    useEffect(() => {
        dispatch(listProducts(keyword))

    }, [dispatch, keyword])

    return (
        <div>
            {!keyword && <ProductCarousel />}

            <h1>Latest Products</h1>
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    :
                    <div>
                        <Row>
                            {products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate page={page} pages={pages} keyword={keyword} />
                    </div>
            }
        </div>
    )
}

export default HomeScreen