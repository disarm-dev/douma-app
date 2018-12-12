import COMMON from 'config/common';

const find_get_parameter = (parameterName) => {
  let result = null;
  let tmp = [];

  location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === parameterName) { result = decodeURIComponent(tmp[1]); }
    });
  return result;
};

export const store_api_url_if_found_as_query_param = (store) => {
  const query_param = COMMON.api.query_parameter;
  const found = find_get_parameter(query_param);

  if (found) {
    store.commit('set_api_url', found);
    return true;
  } else {
    return false;
  }
};
