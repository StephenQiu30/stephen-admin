import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { userRole, UserRoleEnum } from '@/enums/UserRoleEnum';
import { CreateUserModal, UpdateUserModal } from '@/pages/Admin/UserList/components';
import { deleteUser, listUserByPage } from '@/services/user/userController';
import { handleBatchDelete, handleDelete, wrapProTableRequest } from '@/utils/tableUtils';

/**
 * 用户管理列表
 * @constructor
 */
const UserList: React.FC = () => {
  // 新建窗口的Modal框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新窗口的Modal框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.User>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.User>[] = [
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
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户简介',
      dataIndex: 'userProfile',
      valueType: 'text',
      ellipsis: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
      width: 80,
    },
    {
      title: '微信绑定',
      dataIndex: 'wechatStatus',
      hideInSearch: true,
      hideInForm: true,
      width: 100,
      render: (_, record) => (
        <Space>
          {record.mpOpenId || record.wxUnionId ? (
            <Tag color="green">已绑定</Tag>
          ) : (
            <Tag color="default">未绑定</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'GitHub',
      dataIndex: 'githubStatus',
      hideInSearch: true,
      hideInForm: true,
      width: 100,
      render: (_, record) => (
        <Space>
          {record.githubId ? <Tag color="green">已绑定</Tag> : <Tag color="default">未绑定</Tag>}
        </Space>
      ),
    },
    {
      title: '电话',
      dataIndex: 'userPhone',
      valueType: 'text',
      responsive: ['lg'],
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      valueType: 'text',
      responsive: ['lg'],
    },
    {
      title: '邮箱验证',
      dataIndex: 'emailVerified',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '未验证', status: 'Error' },
        1: { text: '已验证', status: 'Success' },
      },
      width: 100,
      render: (_, record) => {
        return (
          <Tag color={record.emailVerified === 1 ? 'green' : 'red'}>
            {record.emailVerified === 1 ? '已验证' : '未验证'}
          </Tag>
        );
      },
    },
    {
      title: '权限',
      dataIndex: 'userRole',
      valueEnum: userRole,
      render: (_, record) => {
        const role = userRole[record.userRole as UserRoleEnum];
        return <Tag color={role.color}>{role.text}</Tag>;
      },
    },
    {
      title: '最后登录',
      sorter: true,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      width: 160,
      responsive: ['xl'],
    },
    {
      title: '登录IP',
      dataIndex: 'lastLoginIp',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      width: 120,
      responsive: ['xl'],
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
              await handleDelete(deleteUser, record.id, '删除成功', actionRef);
            }}
          >
            <Typography.Link
              key={'delete'}
              type={'danger'}
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
      <ProTable<API.User, API.UserQueryRequest>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}

        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              key="create"
              icon={<PlusOutlined />}
              type={'primary'}
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
                  handleBatchDelete(deleteUser, selectedRowsState, '批量删除成功', actionRef, setSelectedRows);
                }}
              >
                批量删除
              </Button>
            )}
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          return await wrapProTableRequest(
            listUserByPage,
            params,
            sort,
            filter,
          );
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        scroll={{ x: 800 }}
      />


      {/*新建表单的Modal框*/}
      {createModalVisible && (
        <CreateUserModal
          onCancel={() => {
            setCreateModalVisible(false);
          }}
          onSubmit={async () => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
          visible={createModalVisible}
        />
      )}

      {/*更新表单的Modal框*/}
      {updateModalVisible && (
        <UpdateUserModal
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
          onSubmit={async () => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
          visible={updateModalVisible}
          oldData={currentRow}
        />
      )}
    </>
  );
};
export default UserList;
