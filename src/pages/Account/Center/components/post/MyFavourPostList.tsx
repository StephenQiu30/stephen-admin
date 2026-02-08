import React, { useRef } from 'react';
import { PostCard } from '@/components';
import { ActionType, ProList } from '@ant-design/pro-components';
// import { listMyFavourPostByPage } from '@/services/post/postFavourController';

/**
 * 我的帖子
 * @constructor
 */
const MyFavourPostList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProList<API.PostVO>
      onChange={() => {
        actionRef.current?.reload();
      }}
      pagination={{
        pageSize: 5,
        showQuickJumper: true,
        responsive: true,
      }}
      actionRef={actionRef}
      itemLayout="vertical"
      rowKey="id"
      request={async (params, sort, filter) => {
        // TODO: Restore listMyFavourPostByPage when API is available
        return {
          success: true,
          data: [],
          total: 0,
        };
      }}
      renderItem={(item) => <PostCard key={item?.id} post={item} />}
    />
  );
};

export default MyFavourPostList;
