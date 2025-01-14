import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import MyBookingCard from '../MyBookingCard/MyBookingCard';
import "./MyBookings.css";
import { useNavigate } from 'react-router-dom';
const MyBookings = () => {
    const { user,admin } = useAuth();
    
    const navigate=useNavigate();
    const [myBookedOffers, setMyBookedOffers] = useState([]);
    useEffect(() => {
        fetch(`https://trip-tuck-2-server.onrender.com/bookings/${user?.email}`)
            .then(res => res.json())
            .then(data => setMyBookedOffers(data))
    }, [myBookedOffers,user])
    
    useEffect(()=>{
        if(admin)navigate('/allbookings');

    },[admin,navigate])
    return (
        
            myBookedOffers?.length>0?
            <div className="w-75 mx-auto mt-5" id="my-bookings" style={{ marginBottom: "300px" }}>
            <h1 className="heading-title">My Bookings</h1>
            <hr className="heading-line mb-5" />
            <Row lg={3} md={2} sm={1} xs={1}>
                {
                    myBookedOffers.map(myBookedOffer => <MyBookingCard
                        key={myBookedOffer._id}
                        myBookedOffer={myBookedOffer}
                    ></MyBookingCard>)
                }
            </Row>


        </div>:
        myBookedOffers.length===0?
        <div>
                <h1>No Bookings Yet!</h1>
        </div>

        :
        <div>
                <h1>Loading....</h1>
        </div>

        
        
    );
};

export default MyBookings;
