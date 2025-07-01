import useAxios from ".";

// ambil seluruh data barang
export const GetAllBarang = async () => {
  try {
    const response = await useAxios.get("/barang", {
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

export const CreateBarang = async (value) => {
  try {
    const formData = new FormData();

    for (const key in value) {
      formData.append(key, value[key]);
    }

    const response = await useAxios.post("/barang", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

export const UpdateBarang = async (id, value) => {
  try {
    const response = await useAxios.put(`/barang/${id}`, value, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

export const DeleteBarang = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await useAxios.delete(`barang/${id}`, {
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

export const UpdateBarangStatus = async (id, status) => {
  try {
    const response = await useAxios.patch(`/barang/${id}/status`, { status_barang: status }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    // It's good practice to throw the error to be caught by the calling function
    throw error.response?.data || error;
  }
};

export const BarangOwner = async () => {
  try {
    const response = await useAxios.get("/indexOwner", {
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

export const GetBarangByPenitipAndMonth = async (payload) => {
  try {
    const response = await useAxios.post("/indexOwner-p", payload, {
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
