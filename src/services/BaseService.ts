import { Keys } from "~/core/enums"
import axios, { AxiosRequestConfig, Method } from "axios"
import { loadProgressBar } from "axios-progress-bar"
import cookies from "js-cookie"

export const client = axios.create({ baseURL: "/api" })

loadProgressBar(undefined, client)

client.interceptors.request.use((config) => {
  const Authorization = `Bearer ${cookies.get(Keys.Authorization)}`
  const headers = { ...config.headers, Authorization }
  return { ...config, headers }
})

export abstract class BaseService {
  abstract prefix: string
  client = client

  private request = async <T>(
    url: string,
    method: Method,
    config: AxiosRequestConfig = {}
  ) => {
    const finalUrl = `${this.prefix}${url}`

    try {
      const response = await this.client.request<T>({
        url: finalUrl,
        method,
        ...config,
      })

      return response.data
    } catch (error) {
      return Promise.reject(error.response.data)
    }
  }

  protected get = async <T>(url: string, config: AxiosRequestConfig = {}) => {
    return this.request<T>(url, "GET", config)
  }

  protected post = async <T, TData = any>(
    url: string,
    data: TData,
    config: AxiosRequestConfig = {}
  ) => {
    return this.request<T>(url, "POST", { data, ...config })
  }

  protected put = async <T, TData = any>(
    url: string,
    data: TData,
    config: AxiosRequestConfig = {}
  ) => {
    return this.request<T>(url, "PUT", { data, ...config })
  }

  protected delete = async <T>(
    url: string,
    config: AxiosRequestConfig = {}
  ) => {
    return this.request<T>(url, "DELETE", config)
  }
}