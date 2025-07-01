import useAxios from ".";

// ambil seluruh data Customer
export const GetAllCustomer = async () => {
    try {
        const response = await useAxios.get('/Customer', {
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


export const GetCustomerByNama = async (nama) => {
    try {
        const response = await useAxios.get(`/Customer/search/${nama}`, {
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


export const GetCustomerByJabatan = async (jabatan) => {
    try {
        const response = await useAxios.get(`/Customer/${jabatan}`, {
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


export const GetCustomerById = async (id) => {
    try {
        const response = await useAxios.get(`/Customer/${id}`, {
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


export const CreateCustomer = async (value) => {
    try {
        const response = await useAxios.post("/Customer", value, {
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


export const UpdateCustomer = async (values) => {
    try {
        const response = await useAxios.put(`/Customer/${values.id}`, values, {
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


export const DeleteCustomer = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`Customer/${id}`, {
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