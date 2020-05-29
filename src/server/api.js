import axios from 'axios';

export default() => {
  return axios.create({
    baseURL: `http://192.168.100.44:8081`
  });
}; 