import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { TAG_EMPTY } from '@/constants';
import { deletePost, listPostByPage } from '@/services/post/postController';
import { reviewStatus } from '@/enums/ReviewStatusEnum';
import CreatePostModal from '@/pages/Admin/PostList/components/CreatePostModal';
import UpdatePostModal from '@/pages/Admin/PostList/components/UpdatePostModal';
import ViewPostModal from '@/pages/Admin/PostList/components/ViewPostModal';
import ReviewPostModal from '@/pages/Admin/PostList/components/ReviewPostModal';
import BatchReviewPostModal from '@/pages/Admin/PostList/components/BatchReviewPostModal';

/**
 * 用户管理列表
 * @constructor
 */
const PostList: React.FC = () => {
  // 新建窗口的Modal框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新窗口的Modal框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 查看窗口的Modal框
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  // 审核窗口的Modal框
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  // 批量审核窗口的Modal框
  const [batchReviewModalVisible, setBatchReviewModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.PostVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.PostVO[]>([]);

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.PostVO) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deletePost({
        id: row.id as any,
      });
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      message.error(`删除失败: ${error.message}`);
      return false;
    } finally {
      hide();
    }
  };

  /**
   * 批量删除节点
   *
   * @param selectedRows
   */
  const handleBatchDelete = async (selectedRows: API.PostVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deletePost({ id: row.id as any });
        }),
      );
      message.success('批量删除成功');
      actionRef.current?.reloadAndRest?.();
      setSelectedRows([]);
      return true;
    } catch (error: any) {
      message.error(`批量删除失败: ${error.message}`);
      return false;
    } finally {
      hide();
    }
  };

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.PostVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
      ellipsis: true,
      width: 120,
      responsive: ['md'],
      hideInTable: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '收藏用户ID',
      dataIndex: 'favourUserId',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '全局搜索',
      dataIndex: 'searchText',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
      width: 80,
    },
    {
      title: '创建人ID',
      dataIndex: 'userId',
      valueType: 'text',
      responsive: ['md'],
      copyable: true,
      width: 120,
      hideInTable: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      responsive: ['md'],
      render: (_, record) => {
        const tags: string[] =
          typeof record.tags === 'string' ? JSON.parse(record.tags || '[]') : record.tags || [];
        if (tags.length === 0) return <Tag>{TAG_EMPTY}</Tag>;
        return (
          <Space wrap size={4}>
            {tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      valueType: 'select',
      valueEnum: reviewStatus,
      width: 100,
    },
    {
      title: '审核信息',
      dataIndex: 'reviewMessage',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      width: 160,
      responsive: ['lg'],
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link
            key="info"
            onClick={() => {
              setViewModalVisible(true);
              setCurrentRow(record);
            }}
          >
            查看
          </Typography.Link>
          <Typography.Link
            key="review"
            onClick={() => {
              setReviewModalVisible(true);
              setCurrentRow(record);
            }}
          >
            审核
          </Typography.Link>
          <Typography.Link
            key="update"
            onClick={() => {
              setUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </Typography.Link>
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
      <ProTable<API.PostVO, API.PostQueryRequest>
        headerTitle={'帖子列表'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              type={'primary'}
              icon={<PlusOutlined />}
              key="create"
              onClick={() => {
                setCreateModalVisible(true);
              }}
            >
              新建
            </Button>
            {selectedRowsState?.length > 0 && (
              <>
                <Button
                  type={'primary'}
                  key="batchReview"
                  onClick={() => {
                    setBatchReviewModalVisible(true);
                  }}
                >
                  批量审核
                </Button>
                <Button
                  type={'primary'}
                  danger
                  key="batchDelete"
                  onClick={() => {
                    handleBatchDelete(selectedRowsState);
                  }}
                >
                  批量删除
                </Button>
              </>
            )}
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0] || 'createTime';
          const sortOrder = sort?.[sortField] ?? 'descend';

          // 处理 tags 查询，从搜索栏获取 tags 并转换为数组
          const { tags, ...rest } = params as any;
          const tagList = tags ? [tags] : undefined;

          const { data, code } = await listPostByPage({
            ...rest,
            ...filter,
            tags: tagList,
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
        scroll={{ x: 1000 }}
      />

      {/*新建表单的Modal框*/}
      {createModalVisible && (
        <CreatePostModal
          onCancel={() => {
            setCreateModalVisible(false);
          }}
          visible={createModalVisible}
          onSubmit={async () => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}

      {/*更新表单的Modal框*/}
      {updateModalVisible && (
        <UpdatePostModal
          oldData={currentRow}
          visible={updateModalVisible}
          onCancel={() => setUpdateModalVisible(false)}
          onSubmit={async () => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
        />
      )}
      {/*审核表单的Modal框*/}
      {reviewModalVisible && (
        <ReviewPostModal
          oldData={currentRow}
          visible={reviewModalVisible}
          onCancel={() => setReviewModalVisible(false)}
          onSubmit={async () => {
            setReviewModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
        />
      )}
      {/*批量审核表单的Modal框*/}
      {batchReviewModalVisible && (
        <BatchReviewPostModal
          posts={selectedRowsState}
          visible={batchReviewModalVisible}
          onCancel={() => setBatchReviewModalVisible(false)}
          onSubmit={async () => {
            setBatchReviewModalVisible(false);
            setSelectedRows([]);
            actionRef.current?.reload();
          }}
        />
      )}
      {/*查看表单的Modal框*/}
      {viewModalVisible && (
        <ViewPostModal
          onCancel={() => {
            setViewModalVisible(false);
          }}
          visible={viewModalVisible}
          onSubmit={async () => {
            setViewModalVisible(false);
            actionRef.current?.reload();
          }}
          post={currentRow as API.PostVO}
        />
      )}
    </>
  );
};
export default PostList;
