import useAxios from ".";

export const Createtransaksi_penjualan = async (value) => {
  console.log("Call API TRANSAKSI");
  try {
    const response = await useAxios.post("/transaksi-penjualan", value, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    console.log("Response API: ", response);
    return response.data;
  } catch (error) {
    console.error("Detail Error:", error.response?.data);
    throw error.response.data;
  }
};

export const GetAlltransaksi_penjualanAdmin = async () => {
  try {
    const response = await useAxios.get("/transaksi-penjualanA", {
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

export const GetAlltransaksi_penjualanPembeli = async () => {
  try {
    const response = await useAxios.get("/transaksi-penjualanP", {
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

export const verifikasi_pembayaran = async (id) => {
  try {
    const response = await useAxios.put(
      `/verifikasi/${id}`,
      {}, // Body kosong, karena verifikasi hanya butuh ID
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Gagal verifikasi:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const cetakPdf = async () => {
  try {
    const respone = await useAxios.get('/detail-transaksi', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return respone.data;
  }
  catch (error) {
    throw error.response.data;
  }
};

export const getAlltransaksiPenjualan = async () => {
  try {
    const respose = await useAxios.get('/penjualan-bulanan', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return respose.data.data;
  }
  catch (error) {
    throw error.respone.data;
  }
}