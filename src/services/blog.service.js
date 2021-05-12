import axios from 'axios'

import Auth from './auth.service'
import GlobalData from '../tools/GlobalData'

const BASE_API_URL = `${GlobalData.back_end_server_ip}:${GlobalData.back_end_server_port}/api/`
const blog_API_URL = `${BASE_API_URL}blog/`

class BlogService {
  
  createBlog(title, description, content, feature_image, playlist_ids) {
    const currentUser = Auth.getCurrentUser();
    console.log('playlist_ids 77', playlist_ids)
    return axios.post(`${blog_API_URL}createBlog`, {
      user_id: currentUser.user_id,
      access_key: currentUser.access_key,
      title, 
      description, 
      content, 
      feature_image, 
      playlist_ids
    })
  }

  updateBlog(id, title, description, content, feature_image, playlist_ids) {

    console.log('playlist_ids upBlog', playlist_ids)
    const currentUser = Auth.getCurrentUser();

    return axios.post(`${blog_API_URL}updateBlog/${id}`, {
      user_id: currentUser.user_id,
      access_key: currentUser.access_key,
      title, 
      description, 
      content, 
      feature_image, 
      playlist_ids
    })
  }

  removeBlog(id) {
    const currentUser = Auth.getCurrentUser();
    console.log(currentUser)
    return axios.post(`${blog_API_URL}removeBlog/${id}`, {
      user_id: currentUser.user_id,
      user_key: currentUser.access_key,
    })
  }
  
  getAllBlogList() {
    const currentUser = Auth.getCurrentUser();
    
    return axios.get(`${blog_API_URL}getAllBlogList`, {params: {
      user_id: currentUser.user_id,
      user_key: currentUser.access_key,
    }});
  }

  getCategory(id) {
    return axios.get(`${blog_API_URL}get/${id}`);
  }
  getSingleBlog(id) {
    const currentUser = Auth.getCurrentUser();
    return axios.get(`${blog_API_URL}getSingleBlog/${id}`,{params: {
      user_id: currentUser && currentUser.user_id,
      user_key: currentUser && currentUser.access_key,
    }});
  }

  uploadThumbnail(thumb) {
    let formData = new FormData();
    formData.append("file", thumb);
    console.log('thumb',thumb)
    console.log('formData', formData)
    let thumb_image = async() => {
      let str = ''
      await axios.post(`${blog_API_URL}uploadThumb`, formData ,{
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

  addPlaylistIds(video_id, playlist_ids) {
    console.log('VID &PIDS',video_id, playlist_ids)
    const currentUser = Auth.getCurrentUser();
    return axios.post(`${blog_API_URL}addPlaylistIds?user_id=${currentUser.user_id}&access_key=${currentUser.access_key}&video_id=${video_id}`, playlist_ids);
  }

  getPlaylistIds(blogId) {
    const currentUser = Auth.getCurrentUser();
    return axios.post(`${blog_API_URL}getPlaylistIds?user_id=${currentUser.user_id}&access_key=${currentUser.access_key}&blogId=${blogId}`);
  }


}

export default new BlogService();