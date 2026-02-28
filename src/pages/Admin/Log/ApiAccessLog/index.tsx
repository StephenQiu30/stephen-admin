import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { listLogByPage2 } from '@/services/log/apiAccessLogController';
import { deleteLog2 } from '@/services/log/apiAccessLogController';
import { ApiAccessStatusEnumMap } from '@/enums/ApiAccessStatusEnum';
import ViewApiAccessLogModal from './components/ViewApiAccessLogModal';

/**
 * API 访问日志页面
 */
const ApiAccessLog: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.ApiAccessLogVO[]>([]);

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
          <ViewApiAccessLogModal record={record}>
            <Typography.Link>详情</Typography.Link>
          </ViewApiAccessLogModal>
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
          const sortField = Object.keys(sort)?.[0] || 'createTime';
          const sortOrder = sort?.[sortField] ?? 'descend';

          const { data, code } = await listLogByPage2({
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
    </>
  );
};

export default ApiAccessLog;
