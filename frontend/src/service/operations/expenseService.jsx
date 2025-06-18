import api from "../api";  
export const getAllExpense = async()=>{
    const response = await api.get('expenses/getallexpenses');
    console.log(response.data);
    return response.data;
}
export const createExpense = async(formData)=>{
    const response = await api.post('expenses/addexpense',formData);
    return response.data;
}
export const getRecentExpense  = async()=>{
    const response = await api.get('expenses/getrecentexpenses');
    return response.data
}

export const deleteExpense = async(id)=>{
    console.log(id);

 const response =     await api.delete(`expenses/delete-expense/${id}`);
 return response.data;
}