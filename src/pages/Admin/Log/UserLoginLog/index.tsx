import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { listLogByPage } from '@/services/log/userLoginLogController';
import { deleteLog } from '@/services/log/userLoginLogController';
import { LoginStatusEnumMap } from '@/enums/LoginStatusEnum';

/**
 * 登录日志页面
 */
const UserLoginLog: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserLoginLogVO[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.UserLoginLogVO>();

  const handleDelete = async (record: API.UserLoginLogVO) => {
    const hide = message.loading('正在删除');
    try {
      await deleteLog({
        id: record.id as any,
      });
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

  const handleBatchDelete = async (selectedRows: API.UserLoginLogVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deleteLog({ id: row.id as any });
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

  const handleViewDetail = (record: API.UserLoginLogVO) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const columns: ProColumns<API.UserLoginLogVO>[] = [
    { title: '用户账号', dataIndex: 'account', width: 120, copyable: true },
    {
      title: 'IP地址',
      dataIndex: 'clientIp',
      width: 120,
      responsive: ['md'],
      render: (ip) => <Typography.Text copyable>{ip}</Typography.Text>,
    },
    { title: '登录类型', dataIndex: 'loginType', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: LoginStatusEnumMap,
    },
    {
      title: '登录时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
      responsive: ['md'],
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link onClick={() => handleViewDetail(record)}>详情</Typography.Link>
          <Popconfirm
            title="确定删除？"
            description="删除后将无法恢复?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDelete(record)}
          >
            <Typography.Link type={'danger'}>删除</Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<API.UserLoginLogVO>
        headerTitle="登录日志"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        request={async (params, sort, filter) => {
          const { data, code } = await listLogByPage({
            ...params,
            ...filter,
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
        scroll={{ x: 900 }}
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
      <Modal
        title="登录日志详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="日志ID">{currentRecord?.id}</Descriptions.Item>
          <Descriptions.Item label="用户ID">{currentRecord?.userId}</Descriptions.Item>
          <Descriptions.Item label="登录账号">{currentRecord?.account}</Descriptions.Item>
          <Descriptions.Item label="登录类型">{currentRecord?.loginType}</Descriptions.Item>
          <Descriptions.Item label="登录状态">
            {currentRecord?.status === 'SUCCESS' ? (
              <Typography.Text type="success">成功</Typography.Text>
            ) : (
              <Typography.Text type="danger">失败</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="客户端IP">{currentRecord?.clientIp}</Descriptions.Item>
          {currentRecord?.status === 'FAILURE' && (
            <Descriptions.Item label="失败原因" span={2}>
              {currentRecord?.failReason}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="User-Agent" span={2}>
            {currentRecord?.userAgent}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {currentRecord?.createTime}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default UserLoginLog;
