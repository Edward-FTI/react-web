import useAxios from ".";

export const GetAllKategori = async () => {
    try {
        const response = await useAxios.get('/kategori', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching kategori:", error.response || error.message);
        throw error.response?.data || error.message;
    }
};


export const LaporanKategori = async () => {
    try {
        const response = await useAxios.get('/laporan/kategori-barang', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        console.log("Response LaporanKategori full:", response);
        console.log("Response LaporanKategori.data:", response.data);
        // Jika response.data.data undefined, fallback ke response.data
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error fetching laporan kategori:", error.response || error.message);
        throw error.response?.data || error.message;
    }
}

