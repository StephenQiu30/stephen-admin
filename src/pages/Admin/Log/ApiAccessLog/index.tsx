import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { deleteLog2 } from '@/services/log/apiAccessLogController';
import { searchApiAccessLogByPage } from '@/services/search/searchController';

/**
 * API 访问日志页面
 */
const ApiAccessLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.ApiAccessLogVO) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteLog2({
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

  const columns: ProColumns<API.ApiAccessLogVO>[] = [
    { title: 'ID', dataIndex: 'id', width: 80, hideInForm: true, copyable: true },
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
        <Tag color={record.status === 200 ? 'success' : 'error'}>{record.status}</Tag>
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
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      render: (_, record) => (
        <Space size={'middle'}>
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
    <ProTable<API.ApiAccessLogVO>
      headerTitle="API 访问日志"
      actionRef={actionRef}
      rowKey="id"
      search={{ labelWidth: 100 }}
      request={async (params, sort, filter) => {
        const sortField = Object.keys(sort)?.[0] || 'createTime';
        const sortOrder = sort?.[sortField] ?? 'descend';

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
