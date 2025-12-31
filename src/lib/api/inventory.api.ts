import api from "../axios/axios"

export const getAllItems = async () => {
    const res = await api.get("/inventory");
    return res.data.data;
}