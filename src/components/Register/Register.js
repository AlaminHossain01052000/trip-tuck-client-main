import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useFirebase from '../../hooks/useFirebase';
import "./Register.css";
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const Register = () => {
    const [error, setError] = useState(false)
    const navigate = useNavigate();
    const { registerNewUser, loading } = useFirebase();
  const [showPassword,setShowPassword]=useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      // Password validation regex (6-8 characters, at least one uppercase letter, one lowercase letter, one number, and one symbol)
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$^&*])[A-Za-z\d@$^&*]{6,8}$/;
  
      // Check if the field is password and validate the value
      if (name === 'password' && !passwordRegex.test(value)) {
          setError('Password must be 6-8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol');
      } else {
          setError(false);
      }
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };
  

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        registerNewUser(formData.name, formData.email, formData.password, navigate)
        console.log('Form submitted:', formData);
    };

    return (
        loading ?
            <div style={{ marginTop: '20px' }}>
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
            <div className="register-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2 className='register-form-heading'>Sign up</h2>


                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className='d-flex jusitfy-content-center align-items-center'>
                        <input
                            type={showPassword?'text':'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <i className="fas fa-eye ms-1" style={{cursor:'pointer'}} onClick={()=>setShowPassword(!showPassword)}></i>
                        </div>
                        
                        {error && <span className="error-message">{error}</span>}
                        
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type={showPassword?'text':'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <button type="submit" className='btn btn-danger'>Submit</button>
                    {error && <h6>{error}</h6>}
                </form>


                <h5 className='mt-3'>Already signed up?</h5>
                <h6><Link to="/login">Sign in</Link> Now</h6>
            </div>


    );
};

export default Register;


// import React, { useState } from 'react';
// import { useNavigate  } from 'react-router';
// import useFirebase from '../../hooks/useFirebase';
// import "./Register.css";
// import { Link } from 'react-router-dom';
// import { Spinner } from 'react-bootstrap';
// const Register = () => {
    
//     const [error,setError] = useState(false)

//     const navigate = useNavigate();
    
//     const {  registerNewUser,loading } = useFirebase();
//     const [formData, setFormData] = useState({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     });
      
//       const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//           ...prevData,
//           [name]: value,
//         }));
//       };
    
//       const handleSubmit = (e) => {
//         e.preventDefault();
//         // Add your form submission logic here
//         registerNewUser(formData.name,formData.email,formData.password,navigate)
//         console.log('Form submitted:', formData);
//       };
    
//     return (
//       loading?
//         <div style={{marginTop:'20px'}}>
//           <Spinner animation="grow" variant="primary" />
//           <Spinner animation="grow" variant="secondary" />
//           <Spinner animation="grow" variant="success" />
//           <Spinner animation="grow" variant="danger" />
//           <Spinner animation="grow" variant="warning" />
//           <Spinner animation="grow" variant="info" />
//           <Spinner animation="grow" variant="light" />
//           <Spinner animation="grow" variant="dark" />

//         </div>

//         :
//         <div className="register-container">
//         <form className="register-form" onSubmit={handleSubmit}>
//           <h2 className='register-form-heading'>Sign up</h2>
  
  
//           <div className="form-group">
//             <label htmlFor="name">Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
  
//           <button type="submit" className='btn btn-danger'>Submit</button>
//           {error&&<h6>{error}</h6>}
//         </form>
  
        
//         <h5 className='mt-3'>Already signed up?</h5>
//         <h6><Link to="/login">Sign in</Link> Now</h6>
//       </div>
      
        
    
//     );
// };

// export default Register;