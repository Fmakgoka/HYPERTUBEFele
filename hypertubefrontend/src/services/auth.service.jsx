
import axios from "axios";

const API_URL = "http://localhost:9000/";

const register = (username, firstname, lastname, email, password, confirm) => {
  return axios.post(API_URL + "register", {
    username,
    firstname,
    lastname,
    email,
    password,
    confirm
  });
};

const password = (password, confirm) => {
  return axios.post(API_URL + "resetpassword", {
    password,
    confirm,
  });
};

const forgotpassword = (email) => {
  return axios.post(API_URL + "forgotpassword", {
    email,
  });
};


const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};
const oAuthlogin = (service) => {
  console.log('service', service);
  console.log(API_URL + "auth/" + service);
  return axios
    .get(API_URL + "auth/" + service, {
      headers: {
        'content-Type': 'application/json',
        "mode": "no-cors"
        // 'x-access-token': `${currentUser.accessToken}`
      }
    })
    .then((response) => {
      if (response.data.accessToken) {
        console.log(response.data)
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
}
const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const upload = async (image) => {
  const fd = new FormData();
  fd.append('image', image);
  console.log(`front image ${fd}`);
  const config = {
    headers: {
      'content-Type': 'multipart/form-data',
      'x-access-token': `${getCurrentUser().accessToken}`

    }
  }
  try {
    const res = await axios.post(API_URL + 'profile/images', fd, config)
    //.then((res) => { console.log(uploaded) }).catch((err) => console.log(err))
    console.log(res.data)
  } catch (error) {
    console.log(error);

  }
}

export default {
  oAuthlogin,
  register,
  login,
  logout,
  forgotpassword,
  getCurrentUser,
  upload,
  password,

};