import axios from 'axios';

const API_URL = 'http://localhost:5100/api/locations'; // 确保端口是5100

export const getLocations = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
};

export const addLocation = async (location) => {
  try {
    const response = await axios.post(API_URL, location, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding location:', error);
  }
};

// 添加 createLocation 作为 addLocation 的别名
export const createLocation = addLocation;

export const updateLocation = async (id, location) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, location, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

export const deleteLocation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting location:', error);
  }
};