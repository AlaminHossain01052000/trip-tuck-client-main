import React, { useEffect } from 'react';
import Banner from '../Banner/Banner';
import ContactUs from '../ContactUs/ContactUs';
import DiscountBanner from '../DiscountBanner/DiscountBanner';
import OurOffers from '../OurOffers/OurOffers';
import OurTourGallery from '../OurTourGallery/OurTourGallery';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Home = () => {
    const navigate=useNavigate();
    const {admin}=useAuth();
    useEffect(()=>{
        if(admin)navigate('/allbookings');
        
    },[admin,navigate])
    return (
        <div>
            <Banner></Banner>
            <OurOffers></OurOffers>
            <OurTourGallery></OurTourGallery>
            <DiscountBanner></DiscountBanner>
            <ContactUs></ContactUs>
            <Footer/>
        </div>
    );
};

export default Home;
