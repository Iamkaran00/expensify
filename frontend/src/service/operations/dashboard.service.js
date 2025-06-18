import api from "../api";

export const getDashboardOverview = async () => {
  try {
    const response = await api.get("/dashboard/getdashboardoverview");
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
