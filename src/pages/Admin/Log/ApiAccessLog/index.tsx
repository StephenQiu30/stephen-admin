import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { listLogByPage2 } from '@/services/log/apiAccessLogController';
import { deleteLog2 } from '@/services/log/apiAccessLogController';
import { ApiAccessStatusEnumMap } from '@/enums/ApiAccessStatusEnum';

/**
 * API 访问日志页面
 */
const ApiAccessLog: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.ApiAccessLogVO[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.ApiAccessLogVO>();

  const handleDelete = async (record: API.ApiAccessLogVO) => {
    const hide = message.loading('正在删除');
    try {
      await deleteLog2({
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

  const handleBatchDelete = async (selectedRows: API.ApiAccessLogVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deleteLog2({ id: row.id as any });
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

  const handleViewDetail = (record: API.ApiAccessLogVO) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const columns: ProColumns<API.ApiAccessLogVO>[] = [
    { title: '用户ID', dataIndex: 'userId', width: 120, copyable: true },
    {
      title: '请求方式',
      dataIndex: 'method',
      width: 100,
      render: (_, record) => {
        const colors: Record<string, string> = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red',
        };
        return <Tag color={colors[record.method!] || 'default'}>{record.method}</Tag>;
      },
    },
    { title: '请求路径', dataIndex: 'path', ellipsis: true },
    {
      title: '响应状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: ApiAccessStatusEnumMap,
    },
    { title: '耗时 (ms)', dataIndex: 'latencyMs', width: 100, hideInSearch: true, sorter: true },
    { title: 'IP地址', dataIndex: 'clientIp', width: 120, hideInSearch: true, responsive: ['lg'] },
    {
      title: '时间',
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
      <ProTable<API.ApiAccessLogVO>
        headerTitle="API 访问日志"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        request={async (params, sort, filter) => {
          const { data, code } = await listLogByPage2({
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
        title="API 访问日志详情"
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
          <Descriptions.Item label="链路追踪ID">{currentRecord?.traceId}</Descriptions.Item>
          <Descriptions.Item label="用户ID">{currentRecord?.userId}</Descriptions.Item>
          <Descriptions.Item label="请求方式">
            <Tag color="blue">{currentRecord?.method}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="请求路径" span={2}>
            {currentRecord?.path}
          </Descriptions.Item>
          <Descriptions.Item label="查询参数" span={2}>
            <pre style={{ maxHeight: 200, overflow: 'auto' }}>{currentRecord?.query || '-'}</pre>
          </Descriptions.Item>
          <Descriptions.Item label="响应状态码">
            <Tag
              color={currentRecord?.status && currentRecord.status >= 200 && currentRecord.status < 300 ? 'green' : 'red'}
            >
              {currentRecord?.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="请求耗时">{currentRecord?.latencyMs} ms</Descriptions.Item>
          <Descriptions.Item label="客户端IP">{currentRecord?.clientIp}</Descriptions.Item>
          <Descriptions.Item label="请求大小">{currentRecord?.requestSize} bytes</Descriptions.Item>
          <Descriptions.Item label="响应大小">{currentRecord?.responseSize} bytes</Descriptions.Item>
          <Descriptions.Item label="User-Agent" span={2}>
            {currentRecord?.userAgent}
          </Descriptions.Item>
          <Descriptions.Item label="Referer" span={2}>
            {currentRecord?.referer || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {currentRecord?.createTime}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ApiAccessLog;
