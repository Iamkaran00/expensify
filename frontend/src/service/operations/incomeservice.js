import api from "../api";
export const getAllIncome = async ()=>{
    const response = await api.get('/incomes/get_all_incomes');
    return response.data;
}
export const createIncome = async(incomedata)=>{
    console.log(incomedata,'incomedata');
    try {
         const response = await api.post('/incomes/add_income',incomedata);
        return response.data;
    } catch (error) {
        console.log("an error occured",error);
    }
}
export const getRecentIncomes = async()=>{
    const response = await api.get('/incomes/getRecentIncomes')
        return response.data;
    }
export const deleteIncomes = async(id)=>
{
 
const response =     await api.delete(`/incomes/deleteIncome/${id}`);
return response.data;
}
