import useAxios from ".";

// GET semua penitip
export const GetAllPenitip = async () => {
    try {
        const response = await useAxios.get('/penitip', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const GetPenitipData = async () => {
    try {
        const response = await useAxios.get("/penitipD", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
// GET penitip berdasarkan nama
export const GetPenitipByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/penitip/search/${nama}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// GET penitip berdasarkan ID
export const GetPenitipById = async (id) => {
    try {
        const response = await useAxios.get(`/penitip/${id}`, {
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// POST penitip baru
export const CreatePenitip = async (value) => {
    try {
        const formData = new FormData();
        for (const key in value) {
            formData.append(key, value[key]);
        }

        const response = await useAxios.post("/penitip", formData, {
            headers: {
                // "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// export const UpdatePenitip = async (id, data) => {
//     try {
//         const response = await useAxios.put(`/penitip/${id}`, data, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             },
//         });
//         return response.data.data;
//     }
//     catch (error) {
//         throw error.response.data;
//     }
// }

export const UpdatePenitip = async (id, data) => {
    const response = await axios.put(`/penitip/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        }
    });
    return response.data;
};

// DELETE penitip
export const DeletePenitip = async (id) => {
    try {
        const response = await useAxios.delete(`/penitip/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const GetPenitipIdAll = async () => {
    try {
        const response = await useAxios.get("/penitip-id", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const TarikSaldoPenitip = async (id, jumlah) => {
    try {
        const response = await useAxios.patch(`/penitip/tarik-saldo/${id}`, {
            jumlah: jumlah
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// // API React untuk tarik saldo (ubah ke POST dan kirim jumlah)
// export const TarikSaldoPenitip = async (id, jumlah) => {
//     try {
//         const response = await useAxios.post(`/penitip/tarik-saldo/${id}`, { jumlah }, {
//             headers: {
//                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error;
//     }
// };
