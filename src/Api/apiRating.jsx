import useAxios from ".";
import axios from "axios";

// export const saveRating = async (ratingData) => {
//     return await axios.post(`/rating/store`, ratingData);
// }

export const CreateRating = async (value) => {
    try {
        const response = await useAxios.post("/rating", value, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data; // hanya data, bukan full response
    } catch (error) {
        throw error.response.data;
    }
};

