import useAxios from ".";

const SignUp = async (data) => {
  try {
    const response = await useAxios.post("/register", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const SignUpO = async (data) => {
  try {
    const response = await useAxios.post("/register-org", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
const Login = async (data) => {
  try {
    const response = await useAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// export { Login };


// export const GetAllUser = async () => {
//     try {
//         const response = await useAxios.get('/user', {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             },
//         });
//         return response.data.data;
//     }
//     catch (error) {
//         throw error.response.data;
//     }
// }
export { Login, SignUp, SignUpO };
