// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 点赞/取消点赞 点赞或取消点赞指定帖子 POST /post/thumb/ */
export async function doThumb(body: API.PostThumbRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>('/post/thumb/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
