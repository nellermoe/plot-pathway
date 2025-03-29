
// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getStories = async () => {
  try {
    const response = await axios.get(`${API_URL}/stories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const getNetwork = async () => {
  try {
    const response = await axios.get(`${API_URL}/network`);
    return response.data;
  } catch (error) {
    console.error('Error fetching network:', error);
    throw error;
  }
};

export const getPath = async (source, target) => {
  try {
    const response = await axios.get(`${API_URL}/path`, {
      params: { source, target }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching path:', error);
    throw error;
  }
};

export const getConnections = async (character) => {
  try {
    const response = await axios.get(`${API_URL}/connections/${character}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
};

export const initDemoData = async () => {
  try {
    const response = await axios.post(`${API_URL}/init`);
    return response.data;
  } catch (error) {
    console.error('Error initializing demo data:', error);
    throw error;
  }
};
