import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deletePostComment, listPostCommentByPage } from '@/services/post/postCommentController';
import { SortOrder } from 'antd/lib/table/interface';

/**
 * 评论管理列表
 * @constructor
 */
const CommentList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.PostCommentVO[]>([]);

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.PostCommentVO) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deletePostComment({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error(`删除失败: ${error.message}`);
      return false;
    }
  };

  /**
   * 批量删除节点
   *
   * @param selectedRows
   */
  const handleBatchDelete = async (selectedRows: API.PostCommentVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deletePostComment({ id: row.id as any });
        }),
      );
      hide();
      message.success('批量删除成功');
      actionRef.current?.reloadAndRest?.();
      setSelectedRows([]);
      return true;
    } catch (error: any) {
      hide();
      message.error(`批量删除失败: ${error.message}`);
      return false;
    }
  };

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.PostCommentVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'userId',
      valueType: 'text',
      render: (_, record) => (
        <Space>
          {record.userVO?.userAvatar && <Avatar src={record.userVO.userAvatar} size="small" />}
          <span>{record.userVO?.userName || record.userId}</span>
        </Space>
      ),
    },
    {
      title: '帖子ID',
      dataIndex: 'postId',
      valueType: 'text',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      width: 180,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <Space size={'middle'}>
          <Popconfirm
            title="确定删除？"
            description="删除后将无法恢复?"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              await handleDelete(record);
            }}
          >
            <Typography.Link key={'delete'} type={'danger'}>
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<API.PostCommentVO, any>
        headerTitle={'评论列表'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          const sortFieldCamel = Object.keys(sort)?.[0] || 'createTime';
          const sortField = sortFieldCamel.replace(/([A-Z])/g, '_$1').toLowerCase();
          const sortOrder = sort?.[sortFieldCamel] ?? 'descend';

          const { data, code } = await listPostCommentByPage({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as any);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Popconfirm
            title="确定删除？"
            description="删除后将无法恢复?"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              await handleBatchDelete(selectedRowsState);
            }}
          >
            <Button danger type="primary">
              批量删除
            </Button>
          </Popconfirm>
        </FooterToolbar>
      )}
    </>
  );
};
export default CommentList;
