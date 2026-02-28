import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { listLogByPage1 } from '@/services/log/operationLogController';
import { deleteLog1 } from '@/services/log/operationLogController';
import { OperationStatusEnumMap } from '@/enums/OperationStatusEnum';

/**
 * 操作日志页面
 */
const OperationLog: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.OperationLogVO[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.OperationLogVO>();

  const handleDelete = async (record: API.OperationLogVO) => {
    const hide = message.loading('正在删除');
    try {
      await deleteLog1({
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

  const handleBatchDelete = async (selectedRows: API.OperationLogVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deleteLog1({ id: row.id as any });
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

  const handleViewDetail = (record: API.OperationLogVO) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const columns: ProColumns<API.OperationLogVO>[] = [
    { title: '操作者ID', dataIndex: 'operatorId', width: 120, copyable: true },
    { title: '操作人', dataIndex: 'operatorName', width: 120 },
    { title: '模块', dataIndex: 'module', width: 120 },
    { title: '操作类型', dataIndex: 'action', width: 100 },
    {
      title: '状态',
      dataIndex: 'success',
      width: 100,
      valueEnum: OperationStatusEnumMap,
    },
    {
      title: '操作时间',
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
      <ProTable<API.OperationLogVO>
        headerTitle="操作日志"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        request={async (params, sort, filter) => {
          const { data, code } = await listLogByPage1({
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
        scroll={{ x: 1000 }}
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
        title="操作日志详情"
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
          <Descriptions.Item label="操作人ID">{currentRecord?.operatorId}</Descriptions.Item>
          <Descriptions.Item label="操作人">{currentRecord?.operatorName}</Descriptions.Item>
          <Descriptions.Item label="操作模块">{currentRecord?.module}</Descriptions.Item>
          <Descriptions.Item label="操作类型">{currentRecord?.action}</Descriptions.Item>
          <Descriptions.Item label="HTTP方法">{currentRecord?.method}</Descriptions.Item>
          <Descriptions.Item label="请求路径" span={2}>
            {currentRecord?.path}
          </Descriptions.Item>
          <Descriptions.Item label="请求参数" span={2}>
            <pre style={{ maxHeight: 200, overflow: 'auto' }}>{currentRecord?.requestParams || '-'}</pre>
          </Descriptions.Item>
          <Descriptions.Item label="响应状态码">{currentRecord?.responseStatus}</Descriptions.Item>
          <Descriptions.Item label="操作状态">
            {currentRecord?.success === 1 ? (
              <Typography.Text type="success">成功</Typography.Text>
            ) : (
              <Typography.Text type="danger">失败</Typography.Text>
            )}
          </Descriptions.Item>
          {currentRecord?.success === 0 && (
            <Descriptions.Item label="错误信息" span={2}>
              {currentRecord?.errorMessage}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="客户端IP">{currentRecord?.clientIp}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {currentRecord?.createTime}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default OperationLog;
