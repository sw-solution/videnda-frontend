import axios from 'axios'

import Auth from './auth.service'
import GlobalData from '../tools/GlobalData'

const BASE_API_URL = `${GlobalData.back_end_server_ip}:${GlobalData.back_end_server_port}/api/`
const CATEGORY_API_URL = `${BASE_API_URL}category/`

class CategoryService {
  
  addCategory(title, description, thumb, playlists) {
    const currentUser = Auth.getCurrentUser();

    return axios.post(`${CATEGORY_API_URL}add`, {
      user_id: currentUser.user_id,
      access_key: currentUser.access_key,
      title,
      description,
      thumb,
      playlists
    })
  }

  updateCategory(id, title, description, thumb, playlists) {
    const currentUser = Auth.getCurrentUser();

    return axios.post(`${CATEGORY_API_URL}update/${id}`, {
      user_id: currentUser.user_id,
      access_key: currentUser.access_key,
      title,
      description,
      thumb,
      playlists
    })
  }

  removeCategory(id) {
    const currentUser = Auth.getCurrentUser();

    return axios.post(`${CATEGORY_API_URL}remove/${id}`, {
      user_id: currentUser.user_id,
      user_key: currentUser.access_key,
    })
  }

  getAllCategory() {
    return axios.get(`${CATEGORY_API_URL}getAll`);
  }

  getCategory(id) {
    return axios.get(`${CATEGORY_API_URL}get/${id}`);
  }

  uploadThumbnail(thumb) {
    let formData = new FormData();
    formData.append('file', thumb);
    
    let thumb_image = async() => {
      let str = ''
      await axios.post(`${CATEGORY_API_URL}uploadThumb`, formData ,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then(result => {
        str = result.data.thumb
      })
      return str;
    }
    

    return thumb_image();
  }
}

export default new CategoryService();