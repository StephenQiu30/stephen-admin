// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建API访问日志 记录API访问日志 POST /access/log/add */
export async function createLog2(
  body: API.ApiAccessLogCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/access/log/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除API访问日志 删除指定API访问日志（仅管理员） POST /access/log/delete */
export async function deleteLog2(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/access/log/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取API访问日志列表 分页查询API访问日志（仅管理员） POST /access/log/list/page */
export async function listLogByPage2(
  body: API.ApiAccessLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageApiAccessLogVO>('/access/log/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
