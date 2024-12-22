import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {hostUrl} from "./globals"
import logo from "../assets/images/chips_logo.png";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    // const [resetDone, setResetDone] = useState(false);
    const [errors, setErrors] = useState({
      password: '',
      confirmPassword: '',
      
    });

  

  useEffect(() => {
    setButtonEnabled(validateForm2());
}, [password, confirmPassword]);

  
  
const validateForm2 = () => {
  let formIsValid = true;
  if (!password) {
      formIsValid = false;
  }

  if (!confirmPassword) {
      formIsValid = false;
  }

  if (password && confirmPassword && password !== confirmPassword) {
      formIsValid = false;
  }
  return formIsValid;
};

  const validateForm = () => {
    let tempErrors = { password: '', confirmPassword: '' };
    let formIsValid = true;

    if (!password) {
        tempErrors.password = 'Password is required';
        formIsValid = false;
    }

    if (!confirmPassword) {
        tempErrors.confirmPassword = 'Confirm password is required';
        formIsValid = false;
    }

    if (password && confirmPassword && password !== confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match';
        formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
};

  const handleMouseDownPassword = (e) => {
    e.preventDefault();  
  };
  const handleRegisterClick = () => {
    navigate('/');  // Assuming '/' is your home route
};
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNavigateHome=()=>{
    navigate("/");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) {
        setMessage("Please correct the errors before submitting.");
        return;
    }

    try {
        const response = await axios.post(`${hostUrl}/api/reset/password`, {
            token,
            password
        });
        if(response.success){
          // setResetDone(true);
        }
        setMessage(response.data.message);
    } catch (error) {
        setMessage("Error in creating password. Please try later.");
    }
};
 

    return (
        <div className="flex items-center flex-col h-screen bg-primaryBackground">
            <div className="flex justify-center mb-6 mt-6">
                    <img src={logo} alt="Chips" /> 
                </div>
            <div className="w-full max-w-xs p-6  rounded-xl mt-16 bg-chipBackground">
            <h3 className="text-lg font-medium tracking-wider text-white">
                  Reset Password
                </h3>
                <p className="text-primaryGrey text-xs mt-3">
                •͡˘㇁•͡˘
                </p>
                <div className="border-t border-dividerLine my-2 "></div>
                <div className="mt-8">
                 <TextField
                   label='new password'
                   variant="outlined"
                   type={showPassword ? 'text' : 'password'}
                   error={Boolean(errors.password)}
                  helperText={errors.password}
                   value={password}
                   onChange={(e) =>setPassword(e.target.value)}
                   fullWidth
                   InputProps={{
                     style: { color: 'white', padding: '0px 3px', fontWeight: '300' }, 
                     inputProps: {
                       style: {
                         color: 'white',  
                         fontSize:'14px', 
                       },
                       placeholder:'new password', 
                     },
                     endAdornment: (
                      <InputAdornment position="end" className="mr-2">
                        <IconButton className="mr-2 bg-primaryGrey"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                   }}

                   InputLabelProps={{
                     style: { color: '#A3A3A3' },  
                   }}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       '& fieldset': {
                         borderColor: '#938F99',  
                       },
                       '&:hover fieldset': {
                         borderColor: '#938F99',  
                       },
                       '&.Mui-focused fieldset': {
                         borderColor: '#938F99',  
                       },
                       '&.Mui-focused .MuiInputLabel-root': {
                        color: '#D0BCFF !important',
                      },
                     },
                     '& .MuiInputBase-input::placeholder': {
                      color: '#211F26', 
                       opacity: 1, 
                     },
                     '& .MuiInputBase-root': {
                      maxHeight: '45px',
                      lineHeight: '45px',
                    },
                   }}
                 />
               </div>
               
               <div className="mt-5 mb-0">
                  <TextField
                    label="confirm new password"
                    variant="outlined"
                    type="password"
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                    value={confirmPassword}
                    onChange={(e) =>setConfirmPassword(e.target.value)}
                    fullWidth
                    InputProps={{
                      style: { color: 'white', padding: '0px 3px', fontWeight: '300' }, 
                      inputProps: {
                        style: {
                          color: 'white',  
                          fontSize: '14px', 
                        },
                        placeholder: 'confirm new password', 
                      },
                    }}
                    InputLabelProps={{
                      style: { color: '#A3A3A3' },  
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#938F99',  
                        },
                        '&:hover fieldset': {
                          borderColor: '#938F99',  
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#938F99',  
                        },
                        '&.Mui-focused .MuiInputLabel-root': {
                         color: '#D0BCFF !important',
                       },

                       '&.Mui-error fieldset': {
                        borderColor: '#F2B8B5', 
                      },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#211F26', 
                        opacity: 1, 
                      },
                      '& .MuiInputBase-root': {
                        maxHeight: '45px',
                        lineHeight: '45px',
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#F2B8B5', 
                        
                      },
                    }}
                  />
                </div>
                <div className="justify-center text-center align-center mb-8">
               <button
                  onClick={handleSubmit}
                  className="w-3/5 text-sm font-normal py-2.5 rounded-3xl transition mt-8"
                  style={{backgroundColor:buttonEnabled?'#D0BCFF':'#2B2930', color:buttonEnabled?'#381E72':'grey'}}
                >
                  Reset Password
                </button>
                <p className="text-errorLight font-normal mt-4 text-xs font-inter">{message}</p>
                <p className="mt-2 rounded-full bg-primary px-2 text-buttonText text-sm py-1" onClick={handleNavigateHome}>Return to Home</p>
                <p className="text-center text-white text-xs mb-10 mt-20">
                  Don't have an account?
                  <button onClick={handleRegisterClick} className="text-secondaryText underline ml-1 ">
                    Register
                  </button>
                </p>
                </div>
                
            </div>
        </div>
    );
};

export default ResetPassword;
