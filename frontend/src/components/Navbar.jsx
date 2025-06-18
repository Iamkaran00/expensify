import React,{useEffect, useState} from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import "./Navbar.css";
import { IoHome } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { GiReceiveMoney } from "react-icons/gi";
import { logoutUser } from '../service/operations/authAPI';
import { NavLink ,useNavigate} from 'react-router-dom';
import { getMeAPI } from "../service/operations/authAPI";
export const Navbar = () => {
     const navigate = useNavigate();
     const [loading,setLoading] = useState(false);
     const [imageUrl,setImageUrl] = useState(null);
     const [email,setEmail] = useState(null);
    const logout = async()=>{
       setLoading(true)  ;
    try {
        await logoutUser();
        setLoading(false);
        navigate('/');
    } catch (error) {
        setLoading(false);
        console.log(error);
    }
    }
    const getUser = async ()=>{
      try {
         const response = await getMeAPI();
         if(response){
  console.log(response);
  setImageUrl(response.profilePhoto);
  setEmail(response.email);
         }
      } catch (error) {
      }
    }
    useEffect(()=>{
      getUser();
    },[])
  return (
    <div className='nav-parent'>
      <div className='anotherdiv'>
       <p className='title'>
     Expensify
    </p>
     <div className='container2'>
    <NavLink to = '/dashboard'>
    </NavLink>
   <div className='imageandemail'>
<img src= {imageUrl} alt= 'profile picture' className='profileimg'/>
<p className='emails'>{email}</p>
   </div>
     <div className='nav-buttons-div'> 
   <button onClick={()=>{
navigate('/dashboard')
   }
    }  className='btn'>
      <IoHome className='animated-arrow'/>
      Dashboard</button>
   <button onClick={
    ()=>{
         navigate('/income')
    }
   } className='btn'>
     <GiReceiveMoney className='animated-arrow'/>
    Income Page</button>
   <button onClick={
    ()=>{
navigate('/expense')
    }
    } className='btn'> <GiPayMoney className = 'animated-arrow'/>
      Expense Page</button>
     </div>
     </div>
     </div>
     <div>
    <button onClick={logout} className='logoutbtn'>
        <PiSignOutBold/>
        log out
    </button>
     </div>
    </div>
  )
}
