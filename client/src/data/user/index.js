import { getClient } from "../client";

export const reqModal = async (func) => {
  try {
    const { status, data } = await func();
    if (status === 200) {
      return data;
    } else {
      return {
        status: false,
        msg: `request failed with code ${status}`,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      status: false,
      msg: "Something Unexpected happened",
    };
  }
};

export const signup = (values) => {
  return reqModal(() => getClient().post("/auth/signup", values));
};

export const login = (values) => {
  return reqModal(() => getClient().post("/auth/login", values));
};

export const uploadImages = (values) => {
  return reqModal(() => getClient().post("/upload", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }));
};

export const submitForProcess = (values) => {
  return reqModal(() => getClient().post("/process", values));
};

export const filterWalls = (values) => {
  return reqModal(() => getClient().post("/filter", values));
};
