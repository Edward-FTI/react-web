import useAxios from ".";

export const getAllMerchandise = async () => {
    try {
        const response = await useAxios.get('/penukaran-merchandise', {
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


export const updateTanggalPengambilan = async (id, tanggal) => {
    const response = await fetch(`http://localhost:8000/api/penukaran/${id}/input-tanggal`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ tanggal_penukaran: tanggal })
    });

    if (!response.ok) {
        throw new Error("Gagal menginput tanggal");
    }

    return await response.json();
};
