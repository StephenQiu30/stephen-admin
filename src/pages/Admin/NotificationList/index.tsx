import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {
  batchMarkRead,
  deleteNotification,
  listNotificationByPageAdmin,
  batchDeleteNotification,
} from '@/services/notification/notificationController';
import UpdateNotificationModal from './components/UpdateNotificationModal';
import CreateNotificationModal from './components/CreateNotificationModal';
import { NotificationTypeEnumMap } from '@/enums/NotificationTypeEnum';


const NotificationList: React.FC = () => {
  // 创建通知 Modal
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新窗口的Modal框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Notification>();
  const [selectedRowsState, setSelectedRows] = useState<API.Notification[]>([]);

  /**
   * 批量已读
   * @param selectedRows
   */
  const handleBatchRead = async (selectedRows: API.Notification[]) => {
    const hide = message.loading('正在处理');
    if (!selectedRows) return true;
    try {
      const ids = selectedRows.map((row) => row.id!);
      await batchMarkRead({ ids });
      message.success('批量已读成功');
      actionRef.current?.reloadAndRest?.();
      setSelectedRows([]);
      return true;
    } catch (error: any) {
      message.error(`批量已读失败: ${error.message}`);
      return false;
    } finally {
      hide();
    }
  };

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Notification) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteNotification({
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
  const handleBatchDelete = async (selectedRows: API.Notification[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await batchDeleteNotification({
        ids: selectedRows.map((row) => row.id!),
      });
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
  const columns: ProColumns<API.Notification>[] = [
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
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      ellipsis: true,
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '通知类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: NotificationTypeEnumMap,
      width: 100,
    },
    {
      title: '接收用户ID',
      dataIndex: 'userId',
      valueType: 'text',
      width: 120,
      copyable: true,
    },
    {
      title: '已读状态',
      dataIndex: 'isRead',
      valueType: 'select',
      valueEnum: {
        0: { text: '未读', status: 'Error' },
        1: { text: '已读', status: 'Success' },
      },
      width: 100,
    },
    {
      title: '关联类型',
      dataIndex: 'relatedType',
      valueType: 'text',
      responsive: ['md'],
      width: 100,
    },
    {
      title: '关联ID',
      dataIndex: 'relatedId',
      valueType: 'text',
      responsive: ['md'],
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      width: 160,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link
            key={'update'}
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
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
      <ProTable<API.Notification, API.NotificationQueryRequest>
        headerTitle={'通知列表'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            创建通知
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortFieldCamel = Object.keys(sort)?.[0] || 'createTime';
          const sortField = sortFieldCamel.replace(/([A-Z])/g, '_$1').toLowerCase();
          const sortOrder = sort?.[sortFieldCamel] ?? 'descend';

          const { data, code } = await listNotificationByPageAdmin({
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
          <Popconfirm
            title="确定全部已读？"
            description="确定将选中项标记为已读?"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              await handleBatchRead(selectedRowsState);
            }}
          >
            <Button type="primary">批量已读</Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <CreateNotificationModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={async () => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />
      <UpdateNotificationModal
        oldData={currentRow}
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onSubmit={async () => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
      />
    </>
  );
};
export default NotificationList;
