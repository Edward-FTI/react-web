import useAxios from ".";

export const Gettransaksi_donasi = async () => {
  try {
    const response = await useAxios.get("/transaksi_donasi", {
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

export const Gettransaksi_donasiByNama = async (nama) => {
  try {
    const response = await useAxios.get(`/transaksi_donasi/search/${nama}`, {
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

export const Gettransaksi_donasiById = async (id) => {
  try {
    const response = await useAxios.get(`/transaksi_donasi/${id}`, {
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

export const Createtransaksi_donasi = async (value) => {
  try {
    const response = await useAxios.post("/transaksi_donasi", value, {
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

export const Updatetransaksi_donasi = async (id, value) => {
  try {
    const response = await useAxios.put(`/transaksi_donasi/${id}`, value, {
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

export const Deletetransaksi_donasi = async (id) => {
  try {
    const response = await useAxios.delete(`/transaksi_donasi/${id}`, {
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

export const Donasi_Owner = async (id) => {
  try {
    const response = await useAxios.get(`/donasi/owner`, {
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
//     try {
