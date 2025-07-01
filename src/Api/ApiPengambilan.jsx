import useAxios from ".";

export const GetPengambilan = async () => {
    try {
        const response = await useAxios.get('/pengambilan', {
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

export const GetPegawaiLogin = async () => {
    try {
        const response = await useAxios.get('/pegawai', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


export const GetPengambilanByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/pengambilan/search/${nama}`, {
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

export const GetPengambilanById = async (id) => {
    try {
        const response = await useAxios.get(`/pengambilan/${id}`, {
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

export const CreatePengambilan = async (data) => {
    try {
        const response = await useAxios.post('/pengambilan', data, {
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

export const UpdatePengambilan = async (id, data) => {
    try {
        const response = await useAxios.put(`/pengambilan/${id}`, data, {
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

export const DeletePengambilan = async (id) => {
    try {
        const response = await useAxios.delete(`/pengambilan/${id}`, {
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

export const GetPengambilanPro = async () => {
  try {
    const response = await useAxios.get("/pengambilanP", {
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