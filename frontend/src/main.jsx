import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
 import {ToastContainer} from 'react-toastify'
 
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ToastContainer    position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
        limit={3}  ></ToastContainer>
        
            <App/>
           
  </StrictMode>,
)
