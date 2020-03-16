import $axios from 'axios';

const baseHost = 'https://www.baidu.com';

function createAxios() {
  // 创建实例，配置基本参数
  const axios = $axios.create({
    baseUrl: baseHost
  });
  // 请求拦截器
  axios.interceptors.request.use(config => {
    // 例如添加token
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = {
        Authorization: token,
        ...config.headers
      };
    }

    return config;
  });

  axios.interceptors.response.use(response => {
    return response;
  });

  return axios;
}

function axiosWrapper(promise, options) {
  // 验证处理response
  const successCode = [0];
  const AuthFailedCode = [4003, 4004];
  const errorCode = [-1];
  function validateData(response) {
    let code = -1;

    if (response && response.data && response.data.code) {
      code = response.data.code;
    }
    // 请求成功
    if (successCode.includes(code)) {
      return response;
    }
    // 没有权限
    if (AuthFailedCode.includes(code)) {
      setTimeout(() => {
        window.location.href = baseHost;
      }, 1500);
    }
    // 请求失败
    if (errorCode.includes(code)) {
      let errMsg = '请求失败';
      if (response && response.data && response.data.msg) {
        errMsg = response.data.msg;
      }
      throw new Error(errMsg);
    }
  }

  // 验证通过后，提取需要的data
  function extract(response) {
    return response.data;
  }

  // 处理错误情况
  function handleError(error) {
    // message.error(error)  // antd 的全局提示
    throw error;
  }

  promise
    .then(validateData)
    .then(extract)
    .catch(handleError);
}
// obj2FormData
function obj2FormData(obj) {
  const data = new FormData();
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(item => {
        data.append(key, item);
      });
    } else {
      data.append(key, obj[key]);
    }
  });

  return data;
}
// 过滤值为空的参数
function filterEmptyParams(params) {
  if (params) {
    const keys = Object.keys(params);
    keys.forEach(key => {
      const value = params[key];
      if (`${value}`.trim() === '' || value === null || value === undefined) {
        delete params[key];
      }
    });
    return params;
  }
}

const axios = createAxios();

export { axios, axiosWrapper, obj2FormData, filterEmptyParams };
