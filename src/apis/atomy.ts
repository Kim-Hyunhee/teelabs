import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";

const instance = axios.create({
  baseURL: "https://dev-api.atomyn.kr",
  withCredentials: true,
});

const api = {
  login: async ({ id, password }: { id: string; password: string }) => {
    try {
      const hash = crypto.createHash("sha256");
      const hash_result = hash.update(password, "utf8").digest("base64");
      const form = new FormData();

      form.append("id", id);
      form.append("password", hash_result);

      const { data } = await instance.post("/customerInfo", form);
      return data;
    } catch (error) {
      return false;
    }
  },

  getUserInfo: async ({ atomyJwt }: { atomyJwt: string }) => {
    try {
      const form = new FormData();
      form.append("token", atomyJwt);
      const { data } = await instance.post("/ssoTokenCheck", form);
      return data;
    } catch (error) {
      return false;
    }
  },

  getAccessToken: async ({ atomyJwtRefresh }: { atomyJwtRefresh: string }) => {
    try {
      const form = new FormData();
      form.append("refreshToken", atomyJwtRefresh);
      const { data } = await instance.post("/ssoTokenReissuance", form);
      return data;
    } catch (error) {
      return false;
    }
  },
};

export default api;
