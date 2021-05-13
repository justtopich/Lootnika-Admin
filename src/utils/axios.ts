import { API_URL } from "../config/config";
import axios from "axios";
import { message } from "antd";
import { Res } from '../config/index.type';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false;

export async function axiosPost(url:string, params: {}){
  try {
    const res: Res = await axios.post(url, params);
    return res;
  } catch (err) {
    message.error("Network error");
  }
  return;
}

export async function axiosGet(url:string){
    try {
      const res: Res = await axios.get(url);
      return res;
    } catch (err) {
      console.error(err);
      message.error("Network error");
    }
    return;
}

export async function axiosGetFake(url:string, res: Res, tw: number){
  await new Promise(resolve => {
    setTimeout(resolve, tw)
  })  

  try {
    return res;
  } catch (err) {
    message.error("Network error");
  }
  return;
}

export default axios;
