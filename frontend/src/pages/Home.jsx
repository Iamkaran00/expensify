import { FaArrowRight } from "react-icons/fa6";
import { getMeAPI } from "../service/operations/authAPI";
import { useEffect,useState 
} from "react";
import img from '../assets/Mar-Business_11.jpg'
import { useNavigate } from "react-router-dom";
import './Home.css';
const Home = ()=>{
  const navigate = useNavigate();
 const [flag,setFlag] = useState(false);
  const getuser = async()=>{
    try {
       const response = await getMeAPI();
       if(response){
        console.log(response,'here is the reponse');
        setFlag(true);
       }
    } catch (error) {
      setFlag(false) ;
    }
  }
   useEffect(()=>{
  getuser();
   },[])
  
    return(
        <div className="homecontainer">
 <div className="imgandpara">
  <div className="paragraph">
      <p style={{color:"rgb(25, 1, 20)",fontSize:'4rem',fontWeight:"450"}}>
  Welcome To <span style={{color:"rgb(163, 6, 127)",fontSize:'4rem',fontWeight:"450"}}>Expensify </span>
  
  </p>
  <p style={{color:"black",fontSize:'1.3rem'}}>Take full control of your finances with our sleek and powerful expense tracker. Whether it's your daily chai or monthly rent, effortlessly record your income and expenses — all in one place.</p>
   <div>
    {
       flag === true?(
        <div>
         <button onClick={()=>{
          navigate('/dashboard')
         }} className="btns">Dashboard
          <FaArrowRight/>
         </button>
        </div>
       ):(<div>
        <button onClick={()=>{
          navigate('/signup');
        }} className="btns">
  Get Started
  <FaArrowRight/>
        </button>
       </div>)
    }
  </div>
  </div>
  <img src={img} className="home-img"/>
</div>
 </div>
       
    )
}
export default Home;