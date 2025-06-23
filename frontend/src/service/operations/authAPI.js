import api from "../api";
 export const registerUser = async userData =>{
  console.log(userData);
 const response = await api.post ('/users/signup',userData,{
    headers : {
        'Content-Type' : 'multipart/form-data',
    }
 }
)
 return response.data;
 };
export const loginUser  = async(credentials)=>{
    const response = await api.post('/users/signin',credentials,{
         
    });
     
    return response.data;
}
export const logoutUser =async()=>{
    api.post('/users/signout');
};
export const getMeAPI  = async()=>{
    const res = await api.get(`/users/getme`)
    return res.data;
}
