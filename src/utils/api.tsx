import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Response, Survey } from '../types';

interface GetAll {
  resource: string;
  page?: number;
  populate?: string[];
  municipalityId?: string;
  filter?: string | any;
  query?: string;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
  id?: string;
  geom?: any;
  responseType?: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  error?: any;
}

interface GetOne {
  resource: Resources;
  id?: string | any;
  populate?: string[];
  scope?: string;
}
interface UpdateOne<T = any> {
  resource?: Resources;
  id?: string;
  params?: T;
}

interface Create {
  resource: Resources | string;
  params?: any;
  config?: any;
  id?: string;
}

export enum Resources {
  SURVEYS = 'surveys',
  START_SURVEY = 'sessions/start',
  RESPONSES = 'responses',
}

export enum Populations {
  PAGE = 'page',
  QUESTIONS = 'questions',
}

class Api {
  private AuthApiAxios: AxiosInstance;
  private readonly proxy: string = '/api';

  constructor() {
    this.AuthApiAxios = Axios.create();

    this.AuthApiAxios.interceptors.request.use(
      (config) => {
        config.url = this.proxy + config.url;

        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const res = await endpoint();
    return res.data;
  };

  getAll = async ({ resource, ...rest }: GetAll) => {
    const config = {
      params: rest,
    };

    return this.errorWrapper(() => this.AuthApiAxios.get(`/${resource}/all`, config));
  };

  get = async ({ resource, id, ...rest }: GetAll) => {
    const config = {
      params: { page: 1, pageSize: 10, ...rest },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getOne = async ({ resource, id, ...rest }: GetOne) => {
    const config = {
      params: rest,
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  patch = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`/${resource}/${id ? `/${id}` : ''}`, params),
    );
  };

  post = async ({ resource, id, params, config = {} }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`/${resource}${id ? `/${id}` : ''}`, params, config),
    );
  };

  getCurrentResponse = async (id: string): Promise<Response> => {
    return this.getOne({
      resource: Resources.RESPONSES,
      populate: [Populations.PAGE, Populations.QUESTIONS],
      id,
    });
  };

  submitResponse = async (
    id: string,
    params: { values: { [key: number]: any } },
  ): Promise<{ nextResponse: number }> => {
    return this.post({
      resource: `${Resources.RESPONSES}/${id}/respond`,
      params,
    });
  };

  getAllSurveys = async (): Promise<Survey[]> => {
    return this.getAll({
      resource: Resources.SURVEYS,
    });
  };

  startSurvey = async (params: {
    survey: number;
  }): Promise<{
    id: number;
    survey: number;
    lastResponse: number;
    token: string;
    finishedAt: string;
    createdAt: string;
  }> => {
    return this.post({
      resource: Resources.START_SURVEY,
      params,
    });
  };
}

const api = new Api();

export default api;
