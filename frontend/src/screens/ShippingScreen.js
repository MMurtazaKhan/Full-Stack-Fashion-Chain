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

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

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
        setWalletAdress(accounts[0]);
      } catch (err) {
        console.log(err);
      }
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
          {walletAddress ? (
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