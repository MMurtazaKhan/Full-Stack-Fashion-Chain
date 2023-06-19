import React from 'react'
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css"

function Footer() {
  return (
    <footer>
        {/* <Container>
            <Row>
                <Col classNameName='text-center py-3'>
                    Copyright &copy; ProShop

                </Col>
            </Row>
        </Container> */}
        
 
    <div className="content">
      <div className="top">
        <div className="logo-details">
          <i className="fab fa-slack"></i>
          <span className="logo_name">FashionChain</span>
        </div>
        <div className="media-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>
      </div>
      <div className="link-boxes">
        <ul className="box">
          <li className="link_name">Company</li>
          <li><a href="#">Home</a></li>
          <li><a href="#">Contact us</a></li>
          <li><a href="#">About us</a></li>
          <li><a href="#">Get started</a></li>
        </ul>
        <ul className="box">
          <li className="link_name">Services</li>
          <li><a href="#">Card Payment</a></li>
          <li><a href="#">Cash on Delivery</a></li>
          <li><a href="#">Free Delivery</a></li>
          <li><a href="#">Authentic Products</a></li>
        </ul>
        <ul className="box">
          <li className="link_name">Account</li>
          <li><a href="#">Profile</a></li>
          <li><a href="#">My account</a></li>
          <li><a href="#">Prefrences</a></li>
          <li><a href="#">Purchase</a></li>
        </ul>
        <ul className="box">
          <li className="link_name">Categories</li>
          <li><a href="#">Garments</a></li>
          <li><a href="#">Footwears</a></li>
          <li><a href="#">Watches</a></li>
          <li><a href="#">Sun Glasses</a></li>
        </ul>
        <ul className="box input-box">
          <li className="link_name">Contact Us?</li>
          <li><input type="text" placeholder="Enter your email" /></li>
          <li><input type="button" value="Send"/></li>
        </ul>
      </div>
    </div>
    <div className="bottom-details">
      <div className="bottom_text">
        <span className="copyright_text">Copyright © 2023 <a href="#">FashionChain.</a>All rights reserved</span>
        <span className="policy_terms">
          <a href="#">Privacy policy</a>
          <a href="#">Terms & condition</a>
        </span>
      </div>
    </div>
 

    </footer>
  )
}

export default Footer