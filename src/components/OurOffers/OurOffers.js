import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import ShowOffer from '../ShowOffer/ShowOffer';
import "./OurOffers.css";





const OurOffers = () => {
    const [offers, setOffers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredOffers,setFilteredOffers]=useState([])
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        setLoading(true)
        if(searchText?.length===0||!searchText){

            setFilteredOffers(offers)
        }
        else{
            
             setFilteredOffers(offers.filter(offer=>offer.title.toLowerCase().includes(searchText.toLowerCase())));
            
        }
        setLoading(false)
    },[searchText,offers])
    useEffect(() => {
        setLoading(true)
        try {
            fetch("https://trip-tuck-2-server.onrender.com/offers")
            .then(res => res.json())
            .then(data => {
                setOffers(data)
                setFilteredOffers(data)
            })
        } catch (error) {
            
        }
        finally{
            
        }
        
        setLoading(false)
    }, [])
    const handleRefreshing=()=>{
        setLoading(true)
        setFilteredOffers(offers)
        setSearchText('');
        setLoading(false)
    }
    return (
        loading?
        <Spinner animation="border" variant="dark" />
        :
        <section id="our-offers" className="mt-5">
            <h1 className="heading-title">Our Offers</h1>
            <hr className="heading-line" />
            {/* Search Elements start=====*/}
            <Form inline>
                <InputGroup className="mb-2 mr-sm-2" style={{width:'50%',marginLeft:'auto',flex:1,justifyContent:'center',alignItems:'center',marginRight:'auto',marginTop:'20px'}}>
                    
                        {/* <InputGroup.Text className="bg-light"></InputGroup.Text> */}
                    
                    <FormControl
                        type="text"
                        placeholder="Search..."
                        aria-label="Search"
                        value={searchText}
                        onChange={(e)=>setSearchText(e.target.value)}
                    />
                    
                    {/* <button><i class="fa fa-search" aria-hidden="true"></i></button> */}
                </InputGroup>
            </Form>
             {/* Search Elements ends========= */}
            {filteredOffers?.length > 0 ?
                <Container className="mt-4">

                    <Row lg={3} md={2} sm={1} xs={1}>
                        {
                            filteredOffers.map(offer => <ShowOffer
                                key={offer._id}
                                offer={offer}
                            ></ShowOffer>)
                        }
                    </Row>
                </Container>
                :
                filteredOffers?.length===0?
                <div>
                    <h6>Currently No such offer is exists!</h6>
                    <Button variant='Primary' onClick={handleRefreshing}>Refresh</Button>
                </div>
                :
                <Spinner animation="border" role="status" style={{ marginTop: '10px' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
        </section>
    );
};

export default OurOffers;