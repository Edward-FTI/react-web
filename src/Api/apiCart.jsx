import useAxios from ".";

// Ambil semua item cart milik user yang login
export const GetAllCart = async () => {
    try {
        const response = await useAxios.get('/cart', {
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

// Ambil satu item cart berdasarkan ID
export const GetCartById = async (id) => {
    try {
        const response = await useAxios.get(`/cart/${id}`, {
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

// Tambahkan item ke cart
export const AddToCart = async (value) => {
    try {
        const response = await useAxios.post('/cart', value, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Hapus item dari cart
export const DeleteCart = async (id) => {
    try {
        const response = await useAxios.delete(`/cart/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Update status id_transaksi_penjualan dari cart (checked/un-checked)
export const UpdateTransaksiCart = async (id, status) => {
    try {
        const response = await useAxios.patch(`/cart/${id}/update-transaksi`, { checked: status }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};