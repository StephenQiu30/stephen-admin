import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { CreatePostModal, UpdatePostModal, ViewPostModal } from '@/pages/Admin/PostList/components';
import { PlusOutlined } from '@ant-design/icons';
import { TAG_EMPTY } from '@/constants';
import { deletePost, listPostByPage } from '@/services/post/postController';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    const res = await deletePost({
      id: row.id,
    });
    if (res.code === 0 && res.data) {
      message.success('删除成功');
    } else {
      message.error(`删除失败${res.message}, 请重试!`);
    }
  } catch (error: any) {
    message.error(`删除失败${error.message}, 请重试!`);
  } finally {
    hide();
  }
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
  const [currentRow, setCurrentRow] = useState<API.Post>();
  const [selectedRowsState, setSelectedRows] = useState<API.Post[]>([]);

  /**
   * 批量删除
   * @param selectedRows
   */
  const handleBatchDelete = async (selectedRows: API.Post[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deletePost({
            id: row.id,
          });
        }),
      );
      message.success('删除成功');
      actionRef.current?.reloadAndRest?.();
    } catch (error: any) {
      message.error(`删除失败${error.message}, 请重试!`);
    } finally {
      hide();
      setSelectedRows([]);
    }
  };

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.Post>[] = [
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
              await handleDelete(record);
              actionRef.current?.reload();
            }}
          >
            <Typography.Link
              key={'delete'}
              type={'danger'}
              onClick={() => {
                setCurrentRow(record);
              }}
            >
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <ProTable<API.Post, API.PageParams>
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
                  handleBatchDelete(selectedRowsState);
                }}
              >
                批量删除
              </Button>
            )}
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortFieldCamel = Object.keys(sort)?.[0] || 'update_time';
          const sortOrder = sort?.[sortFieldCamel] ?? 'descend';

          let sortField = sortFieldCamel;
          if (sortField === 'updateTime') {
            sortField = 'update_time';
          }
          if (sortField === 'createTime') {
            sortField = 'create_time';
          }

          // 处理 tags 查询，将字符串转换为数组
          const paramsWithTags = params as API.PageParams & { tags?: string };
          const tags = paramsWithTags.tags ? [paramsWithTags.tags] : undefined;

          const { data, code } = await listPostByPage({
            ...params,
            ...filter,
            tags,
            sortField,
            sortOrder,
          } as API.PostQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
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
          post={currentRow as API.Post}
        />
      )}
    </>
  );
};
export default PostList;
