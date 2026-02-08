// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建通知 POST /notification/add */
export async function addNotification(
  body: API.NotificationAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong>('/notification/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除通知 删除指定通知，仅本人或管理员可操作 POST /notification/delete */
export async function deleteNotification(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/notification/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据 ID 获取通知 GET /notification/get */
export async function getNotificationById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseNotificationVO>('/notification/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据 ID 获取通知实体（管理员） GET /notification/get/admin */
export async function getNotificationEntityById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationEntityByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseNotification>('/notification/get/admin', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据 ID 获取通知 VO GET /notification/get/vo */
export async function getNotificationVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationVOByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseNotificationVO>('/notification/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页获取通知列表 分页获取当前用户的通知列表 POST /notification/list/page */
export async function listNotificationByPage(
  body: API.NotificationQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageNotificationVO>('/notification/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取通知列表（管理员） POST /notification/list/page/admin */
export async function listNotificationByPageAdmin(
  body: API.NotificationQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageNotification>('/notification/list/page/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新通知（管理员） 更新指定通知，仅管理员可操作 POST /notification/update */
export async function updateNotification(
  body: API.NotificationUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/notification/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
