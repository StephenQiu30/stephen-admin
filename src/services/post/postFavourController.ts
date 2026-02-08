// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 收藏/取消收藏 收藏或取消收藏指定帖子 POST /post/favour/ */
export async function doFavour(body: API.PostFavourRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>('/post/favour/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
