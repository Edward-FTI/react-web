import useAxios from ".";

export const GettRequest_donasi = async () => {
  try {
    const response = await useAxios.get("/request-donasi", {
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

export const GettRequest_donasiById = async (id) => {
  try {
    const response = await useAxios.get(`/request-donasi/${id}`, {
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

export const GettRequest_donasiByNama = async (nama) => {
  try {
    const response = await useAxios.get(`/request-donasi/search/${nama}`, {
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

export const CreatetRequest_donasi = async (value) => {
  try {
    const response = await useAxios.post("/request-donasi", value, {
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

export const UpdatetRequest_donasi = async (id, values) => {
  try {
    const response = await useAxios.put(`/request-donasi/${id}`, values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update error:", error.response?.data || error.message);
    throw error.response.data;
  }
};

export const DeletetRequest_donasi = async (id) => {
  try {
    const response = await useAxios.delete(`/request-donasi/${id}`, {
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
export const LapRequest_donasi = async () => {
  try {
    const response = await useAxios.get("/request/owner", {
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
