import useAxios from ".";

// ambil seluruh data pegawai
export const GetAllPegawai = async () => {
    try {
        const response = await useAxios.get('/pegawai', {
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


export const GetPegawaiByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/pegawai/search/${nama}`, {
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



export const GetPegawaiByJabatan = async (jabatan) => {
    try {
        const response = await useAxios.get(`/pegawai/jabatan/${jabatan}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    }
    catch (error) {
        throw error.response.data
    }
}



export const GetPegawaiById = async (id) => {
    try {
        const response = await useAxios.get(`/pegawai/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data
    }
    catch (error) {
        throw error.response.data;
    }
}


export const CreatePegawai = async (value) => {
    try {
        const response = await useAxios.post("/pegawai", value, {
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


export const UpdatePegawai = async (values) => {
    try {
        const response = await useAxios.put(`/pegawai/${values.id}`, values, {
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


export const DeletePegawai = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`pegawai/${id}`, {
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

export const ResetPasswordPegawai = async (values) => {
    try {
        const response = await useAxios.post(`/pegawai/reset-password`, values, {
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
