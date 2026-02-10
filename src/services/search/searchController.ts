// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 聚合搜索查询 POST /search/all */
export async function doSearchAll(body: API.SearchRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseSearchVOObject>('/search/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索 API 访问日志（从 ES 查询） POST /search/api_access_log/page */
export async function searchApiAccessLogByPage(
  body: API.ApiAccessLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/api_access_log/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索邮件记录（从 ES 查询） POST /search/email_record/page */
export async function searchEmailRecordByPage(
  body: API.EmailRecordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/email_record/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索文件上传记录（从 ES 查询） POST /search/file_upload_record/page */
export async function searchFileUploadRecordByPage(
  body: API.FileUploadRecordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/file_upload_record/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索通知（从 ES 查询） POST /search/notification/page */
export async function searchNotificationByPage(
  body: API.NotificationQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/notification/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索操作日志（从 ES 查询） POST /search/operation_log/page */
export async function searchOperationLogByPage(
  body: API.OperationLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/operation_log/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索帖子（从 ES 查询） POST /search/post/page */
export async function searchPostByPage(
  body: API.PostQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/post/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索用户登录日志（从 ES 查询） POST /search/user_login_log/page */
export async function searchUserLoginLogByPage(
  body: API.UserLoginLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/user_login_log/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页搜索用户（从 ES 查询） POST /search/user/page */
export async function searchUserByPage(
  body: API.UserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePage>('/search/user/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
