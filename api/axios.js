import axios from "axios";

const BASE_URL = "https://fashionapp-backend-gtatg0hjbwh4c2dk.canadacentral-01.azurewebsites.net";

const api = axios.create({
  baseURL: BASE_URL,
});

export { BASE_URL };
export default api;
