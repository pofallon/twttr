import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import axios, { AxiosResponse } from 'axios'

axios.defaults.baseURL = 'https://api.twitter.com/'

export interface TwitterCredentials {
  consumerKey: string;
  consumerSecret: string;
  accessToken?: string;
  accessTokenSecret?: string;
}

export class TwitterClient {

  constructor (creds: TwitterCredentials) {

    const oauth = new OAuth({
      consumer: {
        key: creds.consumerKey,
        secret: creds.consumerSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function (baseString, key): string {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      },
      body_hash_function (data): string {
        return crypto.createHash('sha1').update(data).digest('base64')
      }
    })

    axios.interceptors.request.use(config => {
      config.headers = oauth.toHeader(oauth.authorize({
        url: `${config.baseURL}${config.url}`,
        method: config.method || 'GET',
        data: config.data,
        includeBodyHash: true
      }, {
        key: creds.accessToken || '',
        secret: creds.accessTokenSecret || ''
      }))
      return config
    })

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