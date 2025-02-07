import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import "./Header.css";

const Header = () => {
    const { admin,user, handleLogOut } = useAuth();
   
   console.log(admin)

    return (
        <header className="bg-danger">
            <Navbar bg="danger" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="w-100 justify-content-between align-items-center" activeKey="/home">

                            <Nav.Item>
                                <Nav.Link as={Link} to={admin?`/allbookings`:`/home`} className="d-flex align-items-center"><img src="https://i.ibb.co/1fJ7t29/holiday-logo-travel-summer-beach-260nw-597385868.png" className="w-25" alt="" /><span className="ms-2 font-zen fs-5">Trip Tuck</span></Nav.Link>
                            </Nav.Item>
                            <div className="d-lg-flex">
                                {!admin&&
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                </Nav.Item>
                                }
                                





                                {
                                    user?.email && !admin&&<Nav.Item>
                                        <Nav.Link as={Link} to="/myBookings">My Bookings</Nav.Link>
                                    </Nav.Item>

                                }
                                {
                                    user?.email && !admin&&<Nav.Item>
                                        <Nav.Link as={Link} to="/myProfile">My Profile</Nav.Link>
                                    </Nav.Item>

                                }
                                {
                                    user.email&&admin &&
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="/allbookings">Manage All Bookings</Nav.Link>
                                    </Nav.Item>
                                }

                                {
                                    user.email&&admin  && <Nav.Item>
                                        <Nav.Link as={Link} to="/addOffer">Add an Offer</Nav.Link>
                                    </Nav.Item>
                                }

                                {
                                    user?.email ? <Nav.Item>
                                        <Nav.Link as={Link} to="/home" onClick={handleLogOut}>
                                            Logout
                                        </Nav.Link>
                                    </Nav.Item> : <Nav.Item>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    </Nav.Item>

                                }
                                
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    );
};

export default Header;
