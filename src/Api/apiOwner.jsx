import useAxios from ".";


export const GetAllDonasi = async () => {
    try {
        const response = await useAxios.get('/owner', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            },
        });
        return response.data.data;
    }
    catch (error) {
        throw error.response.data;
    }
}

export const UpdateDonasi = async (values) => {
    try {
        const response = await useAxios.put(`/owner/${values.id}`, values, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response.data;
    }
}