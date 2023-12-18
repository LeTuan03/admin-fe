import axiosClient from "./axiosClient";
import axios from "axios";

const mediaApi = {
  async listMedia() {
    const url = "media/list";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async createMedia(data) {
    const url = "/";
    try {
      return response;
      const response = await axios.post(
        "http://localhost:8080/uploadMedia/uploadMedia"
      );
    } catch (error) {
      throw error;
    }
  },
  async updateMedia(data, id) {
    const url = "editMedia/" + id;
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchMedia(keyword) {
    const url = "media/search/" + keyword.target.value;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteMedia(id) {
    const url = "media/delete/" + id;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getDetailMedia(id) {
    const url = "media/getById/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getById(id) {
    const url = "getByIdCampagin/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default mediaApi;
