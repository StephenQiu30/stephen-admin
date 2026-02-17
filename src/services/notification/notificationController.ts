// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建通知 创建新通知，支持智能推断目标和元数据 POST /notification/add */
export async function addNotification(
  body: API.NotificationAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListLong>('/notification/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除通知 批量删除通知，仅本人或管理员可操作 POST /notification/batch/delete */
export async function batchDeleteNotification(
  body: API.NotificationBatchDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInteger>('/notification/batch/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量标记已读 批量标记通知为已读 POST /notification/batch/read */
export async function batchMarkRead(
  body: API.NotificationBatchReadRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInteger>('/notification/batch/read', {
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

/** 根据 ID 获取通知 GET /notification/get/vo */
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

/** 分页获取通知列表（脱敏） POST /notification/list/page/vo */
export async function listNotificationVoByPage(
  body: API.NotificationQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageNotificationVO>('/notification/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 标记通知已读 标记指定通知为已读 POST /notification/read */
export async function markRead(
  body: API.NotificationReadRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/notification/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 标记全部已读 标记当前用户全部通知为已读 POST /notification/read/all */
export async function markAllRead(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/notification/read/all', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取未读数量 获取当前用户未读通知数量 GET /notification/unread/count */
export async function getUnreadCount(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/notification/unread/count', {
    method: 'GET',
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
