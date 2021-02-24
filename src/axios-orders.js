import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://react-burgerking-c7ae3.firebaseio.com/'
});

export default instance;