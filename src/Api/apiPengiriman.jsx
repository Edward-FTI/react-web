// use Axios from 'axios';
import useAxios from ".";
export const GetKurirBarang = async () => {
    try {
        const response = await useAxios.get('/kurir-barang', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    }
    catch (error) {
        throw error.response.data;
    }
}