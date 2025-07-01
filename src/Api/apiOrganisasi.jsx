import useAxios from ".";


export const GetAllOrganisasi = async () => {
    try {
        const response = await useAxios.get('/organisasi', {
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

export const GetPermintaan = async () => {
    try {
        const response = await useAxios.get("/ujiankelas", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const GetOrganisasiByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/organisasi/search/${nama}`, {
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

export const GetOrganisasiByPermintaan = async (permintaan) => {
    try {
        const response = await useAxios.get(`/organisasi/searchByPermintaan/${permintaan}`, {
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

export const GetOrganisasiById = async (id) => {
    try {
        const response = await useAxios.get(`/organisasi/${id}`, {
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

export const UpdateOrganisasi = async (values) => {
    try {
        const response = await useAxios.put(`/organisasi/${values.id}`, values, {
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

export const DeleteOrganisasi = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`/organisasi/${id}`, {
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
