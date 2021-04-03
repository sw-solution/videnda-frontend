import axios from 'axios';
import authHeader from './auth-header';
import Auth from "./auth.service";

import GlobalData from '../tools/GlobalData';

const API_URL = GlobalData.back_end_server_ip + ':' + GlobalData.back_end_server_port + '/api/user/';
//const API_URL = `http://1-58.69.222.102:3030/api/user/`;

const getPublicContent=()=>{
    return axios.get(`${API_URL}all`);
}
const getUserBoard=()=>{
    return axios.get(`${API_URL}user`, {headers: authHeader()});
}
const getModeratorBoard=()=>{
    return axios.get(`${API_URL}mod`, {headers:authHeader()});
}
const getAdminBoard=()=>{
    return axios.get(`${API_URL}admin`, {headers:authHeader()});
}
const addTokens = (ss) => {
    const currentUser = Auth.getCurrentUser();
    return axios.get(`${API_URL}add_tokens?user_id=${currentUser.user_id}&user_key=${currentUser.access_key}`);
}
const addTokenCode=(token_code)=>{
    const currentUser = Auth.getCurrentUser();
    return axios.get(`${API_URL}add_token_code?user_id=${currentUser.user_id}&user_key=${currentUser.access_key}&token_code=${token_code}`);
}
const getPrepaidTokens = () => {
    const currentUser = Auth.getCurrentUser();
    return axios.get(`${API_URL}get_prepaid_tokens?user_id=${currentUser.user_id}&user_key=${currentUser.access_key}`);
}
const addPrepaidToken = (newTokenCount) => {
    const currentUser = Auth.getCurrentUser();
    return axios.post(`${API_URL}add_prepaid_token?user_id=${currentUser.user_id}&user_key=${currentUser.access_key}&token_count=${newTokenCount}`);
}
const deletePrepaidToken = (id) => {
    const currentUser = Auth.getCurrentUser();
    return axios.post(`${API_URL}delete_prepaid_token?user_id=${currentUser.user_id}&user_key=${currentUser.access_key}&id=${id}`);
}
export default {
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
    addTokens,
    addTokenCode,
    getPrepaidTokens,
    addPrepaidToken,
    deletePrepaidToken,
};
