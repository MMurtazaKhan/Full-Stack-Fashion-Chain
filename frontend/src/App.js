import Footer from "./components/Footer";
import Header from "./components/Header";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import {HashRouter as Router, Route, Routes} from "react-router-dom"
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";
import CheckoutForm from "./screens/CheckoutForm";

function App() {
  return (
    <Router className="App">
      <Header />
      <main className="py-3" >
      <Container>
    <Routes>
        <Route path="/" exact element={<HomeScreen/>} />
        <Route path="/login" exact element={<LoginScreen/>} />
        <Route path="/register" exact element={<RegisterScreen/>} />
        <Route path="/profile" exact element={<ProfileScreen/>} />
        <Route path="/login/shipping" exact element={<ShippingScreen/>} />
        <Route path="/placeorder" exact element={<PlaceOrderScreen/>} />
        <Route path="/payment" exact element={<PaymentScreen/>} />
        <Route path="/order/:id" exact element={<OrderScreen/>} />
        <Route exact path="/product/:id" element={<ProductScreen/>} />
        <Route exact path="/cart" element={<CartScreen/>} />
        <Route exact path="/cart/:id" element={<CartScreen/>} />

        <Route exact path="/admin/product/:id/edit" element={<ProductEditScreen/>} />
        <Route exact path="/admin/userlist" element={<UserListScreen/>} />
        <Route exact path="/admin/user/:id/edit" element={<UserEditScreen/>} />

        <Route exact path="/admin/productlist" element={<ProductListScreen/>} />
        <Route exact path="/admin/orderlist" element={<OrderListScreen/>} />
        <Route exact path="/stripe" element={<CheckoutForm/>} />

        

        </Routes>
      </Container>

      </main>
      <Footer />
    </Router>
  );
}

export default App;
