import useAxios from ".";

export const GetTransaksi_Penitipan = async () => {
    try {
        const response = await useAxios.get('/transaksi-penitipan', {
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

export const GetTransaksi_PenitipanById = async (id) => {
    try {
        const response = await useAxios.get(`/transaksi-penitipan/${id}`, {
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

export const GetTransaksi_PenitipanByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/transaksi-penitipan/search/${nama}`, {
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

export const CreatetTransaksi_Penitipan = async (value) => {
    try {
        const response = await useAxios.post('/transaksi-penitipan', value, {
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

export const UpdatetTransaksi_Penitipan = async (id, values) => {
    try {
        const response = await useAxios.put(`/transaksi-penitipan/${id}`, values, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update error:', error.response?.data || error.message);
        throw error.response.data;
    }
};



export const DeletetTransaksi_Penitipan = async (id) => {
    try {
        const response = await useAxios.delete(`/transaksi-penitipan/${id}`, {
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