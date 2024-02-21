import { get,post,put,del } from 'helpers/api_helper.js'
import appendData from 'utils/formData'

  export const saveRoadmap = (data) => {
    return post('/saveRoadMap', data)
  }
  export const getRoadmap = () => {
    return get('/getRoadMap')
  }
  export const saveRoadmapContent = (data) => {
    return post('/saveRoadMapContent', data)
  }
  export const getRoadmapContent = () => {
    return get('/getRoadMapContent')
  }
  export const deleteRoadMapContent = (id) => {
    return del('/deleteRoadMap', id)
  }
import axios from "axios"
import accessToken from "./jwt-token-access/accessToken"
import { useEffect } from "react"

//pass new generated access token here
const token = accessToken

//apply base url for axios
const API_URL = "https://passivo-apis.block-brew.com/api/admin"

export const axiosApi = axios.create({
  baseURL: API_URL,
})

// axiosApi.defaults.headers.common["Authorization"] = token

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

// export async function get(url, config = {}) {
//   return await axiosApi.get(url, { ...config }).then(response => response.data)
// }

// export async function post(url, data, config = {}) {
//   return axiosApi
//     .post(url, { ...data }, { ...config })
//     .then(response => response.data)
// }

// export async function put(url, data, config = {}) {
//   return axiosApi
//     .put(url, { ...data }, { ...config })
//     .then(response => response.data)
// }

// export async function del(url,id, config = {}) {
//   return await axiosApi
//     .delete(url, {
//       params: { id },},{ ...config })
//     .then(response => response.data)
// }

export const useInterceptor = () => {
  useEffect(() => {
    axiosApi.interceptors.request.use(
      function (config) {
        const accessToken = JSON.parse(localStorage.getItem("authUser"))
        // console.log(accessToken, ">>>>>>>>>>")
        config.headers.Authorization =
          accessToken?.token ?? "test000000000000000"
        return config
      },
      function (error) {
        // Do something with request error
        // console.log("errorrrrr", error)
        return Promise.reject(error)
      }
    )
  }, [localStorage.getItem("authUser")])

  useEffect(() => {
    axiosApi.interceptors.response.use(
      function (response) {
        // console.log(response, "response oooooooo")
        return response
      },
      function (error) {
        // console.log("gdfgdgfhdghfdhgfghdfgffggh", error)
        return Promise.reject(error)
      }
    )
  }, [])
}