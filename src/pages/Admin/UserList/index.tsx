import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { userRole } from '@/enums/UserRoleEnum';
import CreateUserModal from '@/pages/Admin/UserList/components/CreateUserModal';
import UpdateUserModal from '@/pages/Admin/UserList/components/UpdateUserModal';
import { deleteUser, listUserByPage } from '@/services/user/userController';

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
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.User) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteUser({
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
  const handleBatchDelete = async (selectedRows: API.User[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      // 假设有 batchDeleteUser 接口，如果没有则需要循环调用 deleteUser
      // 检查 userController 发现没有 batchDeleteUser，只有 deleteUser
      // 所以这里需要循环调用
      await Promise.all(
        selectedRows.map(async (row) => {
          await deleteUser({ id: row.id as any });
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
  const columns: ProColumns<API.User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
      ellipsis: true,
      width: 140,
      responsive: ['md'],
      hideInTable: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户简介',
      dataIndex: 'userProfile',
      valueType: 'textarea',
      ellipsis: true,
      width: 150,
      hideInSearch: true,
      hideInTable: true,
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
      title: '权限',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: userRole,
    },
    {
      title: '最后登录',
      sorter: true,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      width: 160,
      responsive: ['lg'],
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
      width: 150,
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link
            key="update"
            onClick={() => {
              setUpdateModalVisible(true);
              setCurrentRow(record);
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
                  handleBatchDelete(selectedRowsState);
                }}
              >
                批量删除
              </Button>
            )}
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0] || 'createTime';
          const sortOrder = sort?.[sortField] ?? 'descend';

          const { data, code } = await listUserByPage({
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
