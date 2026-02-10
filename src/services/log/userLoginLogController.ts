// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建用户登录日志 记录用户登录日志 POST /user/login/log/create */
export async function createLog(
  body: API.UserLoginLogCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/user/login/log/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户登录日志 删除指定用户登录日志（仅管理员） POST /user/login/log/delete */
export async function deleteLog(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/login/log/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取用户登录日志列表 分页查询用户登录日志（仅管理员） POST /user/login/log/list/page */
export async function listLogByPage(
  body: API.UserLoginLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserLoginLogVO>('/user/login/log/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
