import React, {useState, useEffect} from 'react'
import {Form, Row, Col, Button, Table} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {updateUserProfile, getUserDetails} from '../actions/userActions'
import { useNavigate} from 'react-router-dom'
import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'
    
function ProfileScreen() {
    const userDetails = useSelector(state => state.userDetails)
    const {errors, loading, user} = userDetails
    
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const {success} = userUpdateProfile
    
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    
    const orderListMy = useSelector(state => state.orderListMy)
    const {loading: loadingOrders, error: errorOrders, orders} = orderListMy

    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if(!userInfo){
         navigate('/login')
        }
        else{
            if(!user || !user.name || success || userInfo._id !== user._id){
                dispatch({type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())

            }
            else{
                setName(user.name)
                setEmail(user.email)
            }
        }
     }, [dispatch, navigate, user, userInfo, success])


    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            setMessage('Password and Confirm Password must match')
        }else{
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            console.log('updated..')
        }
    }

  return (
    <Row>
        <Col md={3}>
            <h2>My Profile</h2>
            {message && <Message variant='danger'>{message}</Message> }
    {errors && <Message variant='danger' >{errors}</Message> }
    {loading && <Loader /> }
    <Form onClick={submitHandler}>
        
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

        <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={e=>setEmail(e.target.value)}
            >
            </Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={e=>setPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>


        <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={e=>setConfirmPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' >Update</Button>
    </Form>
        </Col>
        <Col md={9}><h2>My Orders</h2>
            {loadingOrders ? <Loader/> : 
             errorOrders ? <Message variant='danger'>{errorOrders}</Message> :
             (
                <Table striped responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Date</td>
                            <td>Total</td>
                            <td>Paid</td>
                            <td>Delivered</td>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0,10) : (
                                    <i className='fas fa-times' style={{color:'red'}}></i>
                                )}</td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`} >
                                    <Button className='btn-sm' >Details</Button>

                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
             )
            }
         </Col>

    </Row>
  )
}

export default ProfileScreen