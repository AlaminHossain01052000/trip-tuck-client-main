import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import './UserProfile.css';
import useAuth from '../../hooks/useAuth';
import useFirebase from '../../hooks/useFirebase';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [refetch,setRefetch]=useState(false);
  const [showPassword,setShowPassword]=useState(false)
  const { user } = useAuth();
  const navigate=useNavigate();
  const {loading,error}=useFirebase();
  
const {forgetPassword,handleDeleteAccount,hanldeUserVerification}=useFirebase();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/single?email=${user.email}`);
        const data = await response.json();
        
        setUserData(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    console.log(user)
    fetchUserData();
  }, [user,refetch]);

  const handleEdit = (e) => {
    e.preventDefault();
    setEditable(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/user/update/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      setEditable(false);
      setRefetch(true)
      alert("User info is updates succesfully")
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    finally{
        setEditable(false)
        setRefetch(false)
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  const handleChangePassword=(e)=>{
    e.preventDefault();
    forgetPassword(userData.email);
    alert(`A message is sent to your email ${userData.email}.Please Follow that procedure`)
  }
  const handleDeleteProfile=(e)=>{
    e.preventDefault();

    const isConfirm=window.confirm("Are you sure want to delete your account?");

    if(isConfirm&&userData?._id) handleDeleteAccount(userData?._id,navigate);
    else{
      alert("Failed to delete your profile")
    }
  }
  const handleVerification=(e)=>{
    e.preventDefault();
    hanldeUserVerification(navigate);
  } 
  return (
    loading?
    <div className='mt-5'>
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="dark" />
    </div>
    :
    error?
    <p>{error}</p>
    :
    <div className="user-profile">
      <h2>User Profile</h2>
      {userData && (
        <Card>
          <Card.Body>
            {!user?.emailVerified&&<h6><i class="fas fa-exclamation" style={{marginRight:'10px'}}></i> Your account is not verified yet. <span onClick={handleVerification}style={{fontWeight:'bold',color:'blue',cursor:'pointer'}}>Verify Now</span></h6>}
            
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={userData.displayName} readOnly />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={userData.email} readOnly />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type={showPassword?'text':'password'} value={userData?.password?userData?.password:"******"} readOnly />
                <button type="button" className="btn btn-warning" onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"} Password</button>
                <div>
                  <button className="btn btn-danger" onClick={handleChangePassword}>Change Password</button>
                </div>
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" value={editable ? formData?.address : userData?.address} onChange={handleChange} readOnly={!editable} />
              </Form.Group>

              <Form.Group controlId="contact">
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" value={editable ? formData?.contact : userData?.contact} onChange={handleChange} readOnly={!editable} />
              </Form.Group>
            

              {!editable ? (
                <Button variant="primary" onClick={handleEdit}>
                  Edit Profile
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              )}
              <div>
              <Button variant="danger" onClick={handleDeleteProfile}>Delete Account<i className="fas fa-trash-alt" style={{marginLeft:'10px'}}></i></Button>
              </div>
              
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
/*
              <Form.Group controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" value={editable ? formData?.cardNumber : userData?.cardNumber} onChange={handleChange} readOnly={!editable} />
                </Form.Group>


                <Form.Group controlId="cvc">
                <Form.Label>CVC</Form.Label>
                <Form.Control type="text" value={editable ? formData?.cvc : userData?.cvc} onChange={handleChange} readOnly={!editable} />

                </Form.Group>
                <Form.Group controlId="zip">
                <Form.Label>ZIP</Form.Label>
                <Form.Control type="text" value={editable ? formData?.zip: userData?.zip} onChange={handleChange} readOnly={!editable} />
                </Form.Group>
                <Form.Group controlId="expireDate">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control type="text" value={editable ? formData?.expireDate : userData?.expireDate} onChange={handleChange} readOnly={!editable} />
                </Form.Group>
                */