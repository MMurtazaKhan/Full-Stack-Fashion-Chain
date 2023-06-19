import React, {useEffect, useState} from 'react'
import {Row, Col, Button, ListGroup, Image, Card} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Message from '../components/Message'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import {  ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'
import Loader from '../components/Loader'
import {PayPalButton} from 'react-paypal-button-v2'

function OrderScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {loading, error, order} = orderDetails

    // const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderDetails

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    if (!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AW_0UFU-YJeDFGESojGwxX0OCH4n64VHX6uOTiJsTwk87Iv0-cK2Vv_sSPmMNtrRAaottTkvJCYHzY6D'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
    if (!userInfo){
        navigate('/login')
    }

     if (!order || successPay || order._id !== Number(id) || successDeliver){
        dispatch({type: ORDER_PAY_RESET})
        dispatch({type: ORDER_DELIVER_RESET})
        dispatch(getOrderDetails(id))
     }
     else if (!order.isPaid) {
        if (!window.paypal){
            addPayPalScript()
        }else{
            setSdkReady(true)
        }
     }
    }, [order, id, dispatch, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(id, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    

  return loading ? <Loader/> : error ? <Message variant='danger' >{error}</Message> : (

    <div>
        <h1>Order: {id}</h1>
    <Row>
        <Col md={8}>
            <ListGroup variant='flush' >
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p><strong>Name: </strong>{order.user.name}</p>
                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}></a>{order.user.email}</p>
                    {order.isDelivered ? (
                        <Message variant='success' >Delivered At: {order.deliveredAt}</Message>
                    ) : <Message variant='warning' >Not Delivered</Message>}
                    {/* <p><strong>Shipping: </strong></p>
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                    {' '}
                    {order.shippingAddress.postalCode}
                    {' '}
                    {order.shippingAddress.country} */}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p><strong>Mathod: </strong></p>
                    {order.paymentMethod}
                    {order.isPaid ? (
                        <Message variant='success' >Paid At: {order.paidAt}</Message>
                    ) : <Message variant='warning' >Not Paid</Message>}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.length === 0 ? (<Message variant='info'>Your Order is empty</Message>)
                    : (
                        <ListGroup variant='flush' >
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index} >
                                    <Row>

                                        <Col md={1} >
                                            <Image src={item.image} fluid rounded />
                                        </Col>

                                        <Col>
                                            <Link to={`/product/${item.product}`} >{item.name}</Link>
                                        </Col>

                                        <Col md={4}>
                                            {item.qty} X $ {item.price} = $ {(item.qty * item.price).toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )    
                }

                </ListGroup.Item>
            </ListGroup>
        </Col>

        <Col md={4}>
            <Card>
                <ListGroup variant='flush' >

                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Item:</Col>
                            <Col>{order.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping:</Col>
                            <Col>{order.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Tax:</Col>
                            <Col>{order.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Total Price:</Col>
                            <Col>{order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay && <Loader/>}
                            {!sdkReady ? (
                                <Loader/>
                            ) : (
                                <PayPalButton
                                    amount={order.totalPrice}
                                    onSuccess={successPaymentHandler}
                                />

                            )}
                        </ListGroup.Item>
                    )}

                </ListGroup>

                {loadingDeliver && <Loader/>}
                
                {
                    userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn btn-block'
                                onClick={deliverHandler}
                            >
                                Mark As Delivered
                            </Button>
                        </ListGroup.Item>
                    )
                }

            </Card>
            {!order.isPaid && (
            <form
				action={`http://localhost:3000/api/orders/create-checkout-session/${id}`}
				method='POST'
                onSuccess={successPaymentHandler}
			>
				<button className='button' type='submit' style={{height: "35px", width:"350px", color: "white", borderRadius: "10px", backgroundColor: "blue"}}>
					Pay with Stripe
				</button>
			</form>)}
        </Col>
    </Row>
    </div>
  )
}

export default OrderScreen