import React, {useEffect} from 'react'
import {Table, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import { listOrders } from '../actions/orderActions'

function OrderListScreen() {

    

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderList = useSelector(state => state.orderList)
    const {loading, error, orders} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        if( userInfo && userInfo.isAdmin){

            dispatch(listOrders())
        }else{
            navigate('/login')
        }
    }, [dispatch, navigate, userInfo])


  return (
    <div>
        {loading ? <Loader/> : 
         error ? <Message variant='danger' >{error}</Message> : 
         (
            <Table striped responsive bordered hover className='table-sm' >
                <thead>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                </thead>

                <tbody>
                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user && order.user.name}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>

                                        <td>
                                            {order.paidAt}
                                        </td>

                                        

                                        <td>{order.isDelivered === true ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                                <i className='fas fa-check' style={{ color: 'red' }}></i>
                                            )}
                                        </td>

                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button variant='light' className='btn-sm'  >
                                                    Details
                                                </Button>
                                            </LinkContainer>


                                        </td>
                                    </tr>
                                ))}

                </tbody>
            </Table>
         )}
    </div>
  )
}

export default OrderListScreen