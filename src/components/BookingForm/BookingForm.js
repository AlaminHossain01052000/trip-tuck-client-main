import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAuth from '../../hooks/useAuth';
import "./BookingForm.css";
import { Button, Spinner } from 'react-bootstrap';
import useFirebase from '../../hooks/useFirebase';
import {useNavigate} from 'react-router-dom'
const BookingForm = () => {
    const { id } = useParams();
    
    const [myOffer, setMyOffer] = useState({})
    const { user } = useAuth();
    const {hanldeUserVerification}=useFirebase()
    const navigate=useNavigate();
    const [userData,setUserData]=useState({});
    const [saveAsDefault,setSaveAsDefault]=useState(false)
    const [numberOfPeople,setNumberOfPeople]=useState(0);
    const [address,setAddress]=useState('');
    const [contact,setContact]=useState('')
    const [totalCost,setTotalCost]=useState(0)
    const [date,setDate]=useState('')
    useEffect(() => {
        console.log(id)
        fetch(`http://localhost:5000/offers/${id}`)
            .then(res => res.json())
            .then(data => {

                
                setMyOffer(data)
            })
    }, [id])
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/user/single?email=${user.email}`);
            const data = await response.json();
            
            setUserData(data);
            // setFormData(data);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        
        fetchUserData();
      }, [user]);

    //   const handleSave = async (e) => {
    //     e.preventDefault();
    //     try {
    //       await fetch(`http://localhost:5000/user/update/${userData._id}`, {
    //         method: 'PUT',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(formData)
    //       });
    //       setEditable(false);
    //       setRefetch(true)
    //       alert("User info is updates succesfully")
    //     } catch (error) {
    //       console.error('Error updating user data:', error);
    //     }
    //     finally{
    //         setEditable(false)
    //         setRefetch(false)
    //     }
    //   };
    const reset=()=>{
        setAddress('')
        setContact('')
        setDate('')
        setTotalCost(0)
        setNumberOfPeople(0)
    }
    const handleSubmit = e => {
        e.preventDefault();
        
        if (myOffer) {
            const data={
                name:user.displayName,
                email:user.email,
                address,
                selectedOffer:myOffer.title,
                numberOfPeople,
                date,
                img:myOffer.img,
                status:'pending',
                paymentStatus:'unpaid',
                price:myOffer.price,
                totalCost,
                contact
            }
           
            fetch("http://localhost:5000/bookings", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {

                    if (data.insertedId) {
                        alert("successfully submitted");
                        reset();
                    }

                })
                if(saveAsDefault){
                    const formData={
                        ...userData,
                        address:data.address,
                        contact:data.contact
                    }
                    try {
                         fetch(`http://localhost:5000/user/update/${userData._id}`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(formData)
                              });
                             
                              alert("User info is updates succesfully")
                            } catch (error) {
                              console.error('Error updating user data:', error);
                            }
                            finally{
                               
                            }
                }
        }






    };
    const handleVerification=(e)=>{
        e.preventDefault();
        hanldeUserVerification(navigate)
        
        
    }
    const handleReloading=(e)=>{
        e.preventDefault();
        window.location.reload()

    }
    const calcTotalCost=()=>{
        
        let ret="Total Cost: ";
        let val=((parseInt(myOffer?.price)*parseInt(numberOfPeople)));
        if(!isNaN(val))setTotalCost(val)
        else setTotalCost(0)
        if(isNaN(val))val=0;
        else val=val.toString()
        ret+=val;
        console.log(ret)
        return  ret
    }
    const handleInput = (e) => {
        const inputValue = parseInt(e.target.value);
        if (inputValue < 0) {
            e.target.value = 0;
        }
    };
    const handleNumberOfPeopleChange=(e)=>{
        const inputValue = parseInt(e.target.value);
        if (inputValue < 0) {
            e.target.value = 0;
        }
        setNumberOfPeople(parseInt(e.target.value))
        setTotalCost(parseInt(e.target.value)*parseInt(myOffer.price))
    }
    return (

        <div id="booking-form">
            {
                user.emailVerified
                ?
              
                <form onSubmit={handleSubmit}>
                <input type="text" value={user.displayName} disabled/>
                <input type="text" value={user.email} disabled/>
                <input type="text" onChange={(e)=>setAddress(e.target.value)} placeholder="Your Address" value={userData.address}/>
                <input type="text" onChange={(e)=>setContact(e.target.value)} placeholder="Your Contact Info" defaultValue={userData?.contact}/>

                <input type="text" value={myOffer.title} disabled/>

                <input type="number" value={numberOfPeople} onChange={handleNumberOfPeopleChange} placeholder="Number of trevellers" onInput={handleInput}/>

                <input type='date' min={new Date().toISOString().split('T')[0]} onChange={(e)=>setDate(e.target.value)} />

                <input type="number" value={totalCost} onChange={e=>setTotalCost(e.target.value)} disabled/>
                
                
                
                <input type="submit" />
                <div className='d-flex'>
                <input type='checkbox' onChange={()=>setSaveAsDefault(!saveAsDefault)} checked={saveAsDefault} className=' me-3' style={{width:'16px',marginTop:'20px'}}/>
                <label>Save the informations as default</label>
                </div>
            </form>
            
                :
                <div>
                    <p>Your account is not verified!</p>
                    <Button variant='primary' onClick={handleVerification}>Verify Now</Button>
                    <p className='mt-5'>If already verified. Please <span onClick={handleReloading} style={{color:'blue',cursor:'pointer'}}>Reload Now</span></p>
                </div>
            }
            
        </div>
    );
};

export default BookingForm;