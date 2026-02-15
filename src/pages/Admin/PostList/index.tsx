import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { CreatePostModal, UpdatePostModal, ViewPostModal } from '@/pages/Admin/PostList/components';
import { PlusOutlined } from '@ant-design/icons';
import { TAG_EMPTY } from '@/constants';
import { deletePost, listPostByPage } from '@/services/post/postController';
import { SortOrder } from 'antd/lib/table/interface';

/**
 * 驼峰转蛇形命名
 * @param str
 */
const camelToSnake = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * 通用 ProTable request 封装
 */
const wrapProTableRequest = async <U,>(
  serviceApi: (params: U) => Promise<any>,
  params: any,
  sort: Record<string, SortOrder>,
  filter: any,
  defaultSortField: string = 'update_time',
  options?: { isEs?: boolean },
) => {
  const sortFieldCamel = Object.keys(sort)?.[0] || defaultSortField;
  const sortOrder = sort?.[sortFieldCamel] === 'ascend' ? 'ascend' : 'descend';
  const sortField = options?.isEs ? sortFieldCamel : camelToSnake(sortFieldCamel);
  const { data, code } = await serviceApi({
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
};

/**
 * 通用操作处理
 */
const handleOperation = async (action: () => Promise<any>, successText: string = '操作成功') => {
  const hide = message.loading('正在处理');
  try {
    const res = await action();
    if (res.code === 0) {
      message.success(successText);
      return true;
    } else {
      message.error(`操作失败: ${res.message || '未知错误'}`);
      return false;
    }
  } catch (error: any) {
    message.error(`操作失败: ${error.message || '网络错误'}`);
    return false;
  } finally {
    hide();
  }
};

/**
 * 通用删除处理
 */
const handleDelete = async (
  action: (params: { id: any }) => Promise<any>,
  id: any,
  successText: string = '删除成功',
  actionRef?: React.MutableRefObject<ActionType | undefined>,
) => {
  if (!id) return false;
  const success = await handleOperation(() => action({ id }), successText);
  if (success && actionRef) {
    actionRef.current?.reload();
  }
  return success;
};

/**
 * 通用批量删除处理
 */
const handleBatchDelete = async <T extends { id?: any }>(
  action: (params: { id: any }) => Promise<any>,
  selectedRows: T[],
  successText: string = '批量删除成功',
  actionRef?: React.MutableRefObject<ActionType | undefined>,
  setSelectedRows?: (rows: T[]) => void,
) => {
  if (!selectedRows || selectedRows.length === 0) return false;
  const success = await handleOperation(async () => {
    await Promise.all(
      selectedRows.map(async (row) => {
        await action({ id: row.id });
      }),
    );
    return { code: 0, data: true };
  }, successText);

  if (success) {
    actionRef?.current?.reloadAndRest?.();
    setSelectedRows?.([]);
  }
  return success;
};

/**
 * 用户管理列表
 * @constructor
 */
const PostList: React.FC = () => {
  // 新建窗口的Modal框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新窗口的Modal框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 查看帖子信息Modal框
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.PostVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.PostVO[]>([]);

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
      render: (_, record) => (
        <Space>
          <span>{record.userId}</span>
        </Space>
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'thumbNum',
      hideInSearch: true,
      hideInForm: true,
      width: 80,
      responsive: ['lg'],
    },
    {
      title: '收藏数',
      dataIndex: 'favourNum',
      hideInSearch: true,
      hideInForm: true,
      width: 80,
      responsive: ['lg'],
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      responsive: ['md'],
      render: (_, record) => {
        let tags: string[] = [];
        if (typeof record.tags === 'string') {
          try {
            tags = JSON.parse(record.tags);
          } catch (e) {
            tags = [];
          }
        } else if (Array.isArray(record.tags)) {
          tags = record.tags;
        }
        if (tags.length === 0) {
          return <Tag>{TAG_EMPTY}</Tag>;
        }
        return (
          <Space wrap size={4}>
            {tags.map((tag) => (
              <Tag key={tag} color={'blue'}>
                {tag}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'isDelete',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '已删除', status: 'Error' },
      },
      hideInForm: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      width: 160,
      responsive: ['xxl'],
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link
            key="info"
            onClick={() => {
              setViewModalVisible(true);
              setCurrentRow(record);
              actionRef.current?.reload();
            }}
          >
            查看
          </Typography.Link>
          <Typography.Link
            key="update"
            onClick={() => {
              setUpdateModalVisible(true);
              setCurrentRow(record);
              actionRef.current?.reload();
            }}
          >
            修改
          </Typography.Link>
          {/*删除表单用户的PopConfirm框*/}
          <Popconfirm
            title="确定删除？"
            description="删除后将无法恢复?"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              await handleDelete(deletePost, record.id, '删除成功', actionRef);
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
              <Button
                type={'primary'}
                danger
                key="batchDelete"
                onClick={() => {
                  handleBatchDelete(
                    deletePost,
                    selectedRowsState,
                    '批量删除成功',
                    actionRef,
                    setSelectedRows,
                  );
                }}
              >
                批量删除
              </Button>
            )}
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          // 处理 tags 查询，将字符串转换为数组
          const paramsWithTags = params as API.PostQueryRequest & { tags?: string };
          const tags = paramsWithTags.tags ? [paramsWithTags.tags] : undefined;

          return await wrapProTableRequest(listPostByPage, { ...params, tags }, sort, filter);
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
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
          visible={updateModalVisible}
          oldData={currentRow}
          onSubmit={async () => {
            setUpdateModalVisible(false);
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
