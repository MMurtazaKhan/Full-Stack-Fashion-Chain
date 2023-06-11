import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Row, Col, Button} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {register} from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import {useLocation, useNavigate} from 'react-router-dom'

function RegisterScreen() {

    const userRegister = useSelector(state => state.userRegister)
    const {errors, loading, userInfo} = userRegister

    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo){
         navigate(redirect)
        }
     }, [redirect, userInfo, navigate])



    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            setMessage('Password and Confirm Password must match')
        }else{
        dispatch(register(name, email, password))}
    }

  return (
    <FormContainer>
    <h1>Register</h1>
    {message && <Message variant='danger'>{message}</Message> }
    {errors && <Message variant='danger' >{errors}</Message> }
    {loading && <Loader /> }
    <Form onSubmit={submitHandler}>
        
        <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control 
                required
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
                required
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
                required
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={e=>setConfirmPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' >Register</Button>
    </Form>

    <Row className='py-3'>
        <Col>
            Have an account ? <Link
                to={redirect ? `/login?redirect=${redirect}`: '/login'}>Sign In</Link>
        </Col>

    </Row>

</FormContainer>
  )
}

export default RegisterScreen