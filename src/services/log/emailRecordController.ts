// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建邮件记录 记录邮件发送信息 POST /email/record/create */
export async function createRecord1(
  body: API.EmailRecordCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/email/record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除邮件记录 删除指定邮件记录（仅管理员） POST /email/record/delete */
export async function deleteRecord1(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/email/record/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取邮件记录列表 分页查询邮件记录（仅管理员） POST /email/record/list/page */
export async function listRecordByPage1(
  body: API.EmailRecordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageEmailRecordVO>('/email/record/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
