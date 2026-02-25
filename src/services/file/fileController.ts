// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 文件上传 通一样式的文件上传接口，支持按业务类型进行校验 POST /file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadFileParams,
  body: FormData,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString>('/file/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
