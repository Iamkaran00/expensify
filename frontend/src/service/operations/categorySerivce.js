import api from "../api";
export const getAllCategories = async()=>{
    const response = await api.get('/categories/getallcategories');
    return response.data;
}
export const getCategoryById = async id =>{
    const response = await api.get(`/categories/getsinglecategory/${id}`);
    return response.data;

}
export const createcategory  = async categoryData =>{
    const response  = await api.post('/categories/createcategory',categoryData);
    return response.data;
}
export const deletecategory = async id =>{
    const response = await api.delete(`/categories/deletecategory/${id}`);
    return response.data;
}