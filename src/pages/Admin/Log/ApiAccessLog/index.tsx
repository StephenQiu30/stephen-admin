import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useRef } from 'react';
import { searchApiAccessLogByPage } from '@/services/search/searchController';
import { toSnakeCase } from '@/utils';

/**
 * API 访问日志页面
 */
const ApiAccessLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

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
      render: (_, record) => (
        <Tag color={record.status === 200 ? 'success' : 'error'}>
          {record.status === 200 ? '成功' : '失败'} ({record.status})
        </Tag>
      ),
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
  ];

  return (
    <ProTable<API.ApiAccessLogVO>
      headerTitle="API 访问日志"
      actionRef={actionRef}
      rowKey="id"
      search={{ labelWidth: 100 }}
      request={async (params, sort, filter) => {
        const sortFieldCamel = Object.keys(sort)?.[0] || 'createTime';
        const sortField = toSnakeCase(sortFieldCamel);
        const sortOrder = sort?.[sortFieldCamel] ?? 'descend';

        const { data, code } = await searchApiAccessLogByPage({
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
    />
  );
};

export default ApiAccessLog;
