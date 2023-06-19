import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../actions/cartActions";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import FashionChain from "../contracts/FashionChain.json";

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;
  const totalPrice = cartItems.reduce((acc, item)=> acc + item.qty * item.price, 0)
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress.address);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [city, setCity] = useState(shippingAddress.city);
  const [country, setCountry] = useState(shippingAddress.country);
  const [walletAddress, setWalletAdress] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, postalCode, city, country, walletAddress }));
    navigate("/payment");
  };

  // Function to connect the wallet
const connectWallet = async () => {
  if (typeof window.ethereum == "undefined") {
    toast.error("Metamask is not installed!!!");
  } else {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);
      setWalletAdress(accounts[0]);
      return provider; // Return the provider for further use
    } catch (err) {
      console.log(err);
    }
  }
};

// Function to call the smart contract function
const callContractFunction = async (provider) => {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      FashionChain.address,
      FashionChain.abi,
      signer
    );

    const filePrice = ethers.utils.parseEther("0.0001");
    const walletAddress = await signer.getAddress();
    setWalletAdress(walletAddress); // Set the wallet address to the state variable

    const tx = await contract.takeFundsForToken({
      from: walletAddress,
      value: filePrice._hex,
    });

    await tx.wait();
  } catch (err) {
    console.log(err);
  }
};

// Function to connect the wallet and then call the smart contract function
const handleClick = async () => {
  const provider = await connectWallet();
  if (provider) {
    callContractFunction(provider);
  }
};

  useEffect(() => {
    console.log("shipping screen", walletAddress);
  });

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Postal Code"
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter city"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter country"
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* wallet address */}

        <Form.Group controlId="country">
          <Form.Label>Wallet Adress</Form.Label>
          {totalPrice >= 100 ? (
  walletAddress ? (
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
  )
) : (
  <p>.</p>
)}

        </Form.Group>
        {/* <div
          style={{
            margin: "10px 0px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          Wallet address
          <Button variant="primary">Connect Wallet</Button>
        </div> */}

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;