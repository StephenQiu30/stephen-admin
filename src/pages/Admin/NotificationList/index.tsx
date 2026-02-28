import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {
  batchDeleteNotification,
  batchMarkRead,
  deleteNotification,
  listNotificationByPageAdmin,
  markAllRead,
} from '@/services/notification/notificationController';
import { PlusOutlined, ReadOutlined } from '@ant-design/icons';
import UpdateNotificationModal from '@/pages/Admin/NotificationList/components/UpdateNotificationModal';
import CreateNotificationModal from '@/pages/Admin/NotificationList/components/CreateNotificationModal';
import ViewNotificationModal from '@/pages/Admin/NotificationList/components/ViewNotificationModal';
import { NotificationTypeEnumMap } from '@/enums/NotificationTypeEnum';
import { NotificationReadStatusEnumMap } from '@/enums/NotificationReadStatusEnum';

const NotificationList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // Modal 状态管理
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.Notification>();
  const [selectedRowsState, setSelectedRows] = useState<API.Notification[]>([]);

  /**
   * 全部标记已读
   */
  const handleMarkAllRead = async () => {
    const hide = message.loading('正在标记全部已读');
    try {
      await markAllRead();
      message.success('全部标记已读成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      message.error(`全部标记已读失败: ${error.message}`);
      return false;
    } finally {
      hide();
    }
  };

  /**
   * 批量已读
   * @param selectedRows
   */
  const handleBatchRead = async (selectedRows: API.Notification[]) => {
    const hide = message.loading('正在处理');
    if (!selectedRows?.length) return true;
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
   * @param row
   */
  const handleDelete = async (row: API.Notification) => {
    const hide = message.loading('正在删除');
    if (!row?.id) return true;
    try {
      await deleteNotification({ id: row.id as any });
      message.success('删除成功');
      actionRef.current?.reload();
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
   * @param selectedRows
   */
  const handleBatchDelete = async (selectedRows: API.Notification[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows?.length) return true;
    try {
      await batchDeleteNotification({
        ids: selectedRows.map((row) => row.id!),
      });
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
   * 表格列定义
   */
  const columns: ProColumns<API.Notification>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      copyable: true,
      width: 140,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      ellipsis: true,
      width: 180,
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
      width: 110,
    },
    {
      title: '已读状态',
      dataIndex: 'isRead',
      valueType: 'select',
      valueEnum: NotificationReadStatusEnumMap,
      width: 110,
    },
    {
      title: '关联信息',
      dataIndex: 'related',
      hideInSearch: true,
      width: 140,
      render: (_, record) => {
        if (!record.relatedType) return '-';
        return (
          <Space>
            <Tag color="cyan">{record.relatedType}</Tag>
            {record.relatedId && <Typography.Text copyable>{record.relatedId}</Typography.Text>}
          </Space>
        );
      },
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
        <Space size="middle">
          <ViewNotificationModal notification={record}>
            <Typography.Link key="view">查看</Typography.Link>
          </ViewNotificationModal>
          <Typography.Link
            key="update"
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Popconfirm
            title="确定删除？"
            description="删除后将无法恢复？"
            onConfirm={() => handleDelete(record)}
          >
            <Typography.Link key="delete" type="danger">
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
        headerTitle="通知管理"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建通知
          </Button>,
          <Popconfirm
            key="markAllRead"
            title="确定全部标记已读？"
            description="此操作将把您的所有未读通知标记为已读？"
            onConfirm={handleMarkAllRead}
          >
            <Button icon={<ReadOutlined />}>全部已读</Button>
          </Popconfirm>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0] || 'createTime';
          const sortOrder = sort?.[sortField] ?? 'descend';

          const { data, code } = await listNotificationByPageAdmin({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          });

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        scroll={{ x: 1200 }}
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
            key="batchDelete"
            title="确定批量删除？"
            description="删除后将无法恢复？"
            onConfirm={() => handleBatchDelete(selectedRowsState)}
          >
            <Button danger type="primary">
              批量删除
            </Button>
          </Popconfirm>
          <Popconfirm
            key="batchRead"
            title="确定批量已读？"
            description="确定将选中项标记为已读？"
            onConfirm={() => handleBatchRead(selectedRowsState)}
          >
            <Button type="primary">批量已读</Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <CreateNotificationModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />
      <UpdateNotificationModal
        visible={updateModalVisible}
        oldData={currentRow}
        onCancel={() => setUpdateModalVisible(false)}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

export default NotificationList;
