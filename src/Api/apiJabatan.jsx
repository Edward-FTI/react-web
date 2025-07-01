import useAxios from ".";


export const GetAllJabatan = async () => {
    try {
        const response = await useAxios.get('/jabatan', {
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


