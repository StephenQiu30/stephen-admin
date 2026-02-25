import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { searchUserLoginLogByPage } from '@/services/search/searchController';
import { toSnakeCase } from '@/utils';

/**
 * 登录日志页面
 */
const UserLoginLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.UserLoginLogVO>[] = [
    { title: '用户账号', dataIndex: 'account', width: 120, copyable: true },
    { title: 'IP地址', dataIndex: 'clientIp', width: 120, responsive: ['md'], render: (ip) => <Typography.Text copyable>{ip}</Typography.Text> },
    { title: '登录类型', dataIndex: 'loginType', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (_, record) => (
        <Tag color={record.status === 'SUCCESS' || record.status === '200' ? 'success' : 'error'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '登录时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
      responsive: ['md'],
    },
  ];

  return (
    <ProTable<API.UserLoginLogVO>
      headerTitle="登录日志"
      actionRef={actionRef}
      rowKey="id"
      search={{ labelWidth: 100 }}
      request={async (params, sort, filter) => {
        const sortFieldCamel = Object.keys(sort)?.[0] || 'createTime';
        const sortField = toSnakeCase(sortFieldCamel);
        const sortOrder = sort?.[sortFieldCamel] ?? 'descend';

        const { data, code } = await searchUserLoginLogByPage({
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

export default UserLoginLog;
