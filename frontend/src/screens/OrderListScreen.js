import React, {useEffect, useState} from 'react'
import {Table, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import { listOrders } from '../actions/orderActions'
import { ethers } from "ethers";
import { toast } from "react-toastify";
import FashionChain from "../contracts/FashionChain.json";
import axios from 'axios'


function OrderListScreen() {

    const [wallet, setWallet] = useState(null);
    const [adresses, setAdresses] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderList = useSelector(state => state.orderList)
    const {loading, error, orders} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const getWallet = async () => {
        const {data} = await axios.get('/api/orders/get-blockchain/')
        setAdresses(data)
        console.log("addresses",adresses)
    }

    const handleClick = async () => {
        if (typeof window.ethereum == "undefined") {
          toast.error("Metamask is not installed!!!");
        } else {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            console.log("Connected account:", accounts[0]);
            setWallet(accounts[0]);
          } catch (err) {
            console.log(err);
          }
        }
      };
    

    const handleToken = async (orderId, walletAddress, amount) => {
        if(wallet === null){
            toast.error("Metamask not connected!")
            console.log("toasr")
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
        FashionChain.address,
        FashionChain.abi,
        signer
        );

        const tx = await contract.transfer(
         walletAddress,
        parseInt(amount)
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
        await axios.put(`/api/orders/isTokenize/${orderId}`)
        toast.success("Token awarded");
        } else {
        toast.error("Transaction Failed");
        }
  };
    

    useEffect(() => {
        if( userInfo && userInfo.isAdmin){

            dispatch(listOrders())
        }else{
            navigate('/login')
        }
        getWallet()
        
        
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

        {wallet ? (
            <Button
              variant="primary"
              style={{ display: "block", marginBottom: "10px" }}
            >
              Metamask Connected!!!
            </Button>
          ) : (
            <Button
              variant="primary"
              style={{ display: "block", marginBottom: "10px" }}
              onClick={handleClick}
            >
              Connect Wallet
            </Button>
          )}



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
                    <th>WALLET ADDRESS</th>
                    <th>TOKENIZE</th>
                    <th></th>
                </thead>

                <tbody>
                {adresses.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user && order.user.name}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                     

                                        <td>
                                            {order.paidAt}
                                        </td>
                                        <td>${order.walletAddress}</td>
                                        <td>${order.isTokenize}</td>

                                        <td>
                                            <LinkContainer to={`/`} >
                                                <Button variant='light' className='btn-sm' onClick={() => handleToken(order._id, order.walletAddress, order.totalPrice)} >
                                                    Token
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