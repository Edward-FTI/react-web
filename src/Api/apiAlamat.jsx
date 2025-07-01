import useAxios from ".";

// ambil seluruh data alamat
export const GetAllAlamat = async () => {
    try {
        const response = await useAxios.get('/alamat', {
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

// ambil alamat berdasarkan id
export const GetAlamatById = async (id) => {
    try {
        const response = await useAxios.get(`/alamat/${id}`, {
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

// buat alamat baru
export const CreateAlamat = async (value) => {
    try {
        const response = await useAxios.post("/alamat", value, {
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

// update alamat
export const UpdateAlamat = async (values) => {
    try {
        const response = await useAxios.put(`/alamat/${values.id}`, values, {
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

// hapus alamat
export const DeleteAlamat = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`/alamat/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }
}
