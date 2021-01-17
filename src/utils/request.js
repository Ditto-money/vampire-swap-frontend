import fetch from 'unfetch';
import qs from 'query-string';
import { API_URL } from 'config';

export async function get(url, query) {
  if (query) {
    url += '?' + qs.stringify(query);
  }
  return await (await fetch(url)).json();
}

export async function api(url, query) {
  return get(API_URL + url, query);
}
