import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import axios, { AxiosResponse } from 'axios'

export interface TwitterCredentials {
  consumerKey: string;
  consumerSecret: string;
  accessToken?: string;
  accessTokenSecret?: string;
}

export class TwitterClient {

  public baseUrl = 'https://api.twitter.com/'
  public creds: TwitterCredentials

  constructor (creds: TwitterCredentials) {
    this.creds = creds
    const oauth = new OAuth({
      consumer: {
        key: creds.consumerKey,
        secret: creds.consumerSecret
      },
      signature_method: 'HMAC-SHA1',             //eslint-disable-line @typescript-eslint/camelcase
      hash_function (baseString, key): string {  //eslint-disable-line @typescript-eslint/camelcase
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      }
    })
    axios.interceptors.request.use((config) => {
      config.headers = oauth.toHeader(oauth.authorize({
        url: `${config.baseURL}${config.url}`,
        method: config.method || 'GET',
        data: config.data
      }, {
        key: this.creds.accessToken || '',
        secret: this.creds.accessTokenSecret || ''
      }))
      return config
    })
    axios.defaults.baseURL = this.baseUrl
  }

  get(api: string): Promise<AxiosResponse> { 
    return axios.get(api)
  }
  
  post(api: string, data = {}): Promise<AxiosResponse> {
    return axios.post(api, data)
  }

  put(api: string, data = {}): Promise<AxiosResponse> {
    return axios.put(api, data)
  }

  delete(api: string): Promise<AxiosResponse> {
    return axios.delete(api)
  }

}