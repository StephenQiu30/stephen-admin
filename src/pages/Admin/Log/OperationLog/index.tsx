import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef } from 'react';
import { deleteLog1 } from '@/services/log/operationLogController';
import { searchOperationLogByPage } from '@/services/search/searchController';

/**
 * 操作日志页面
 */
const OperationLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.OperationLogVO) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteLog1({
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


  const columns: ProColumns<API.OperationLogVO>[] = [
    { title: 'ID', dataIndex: 'id', width: 80, hideInForm: true, copyable: true },
    { title: '操作者ID', dataIndex: 'operatorId', width: 120, copyable: true },
    { title: '模块', dataIndex: 'module', width: 120 },
    { title: '操作类型', dataIndex: 'action', width: 100 },
    {
      title: '操作方法',
      dataIndex: 'method',
      width: 180,
      ellipsis: true,
      hideInSearch: true,
      responsive: ['lg'],
    },
    {
      title: '状态',
      dataIndex: 'responseStatus',
      width: 100,
      render: (_, record) => (
        <Tag color={record.responseStatus === 200 ? 'success' : 'error'}>
          {record.responseStatus}
        </Tag>
      ),
    },
    {
      title: '操作时间',
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
    <ProTable<API.OperationLogVO>
      headerTitle="操作日志"
      actionRef={actionRef}
      rowKey="id"
      search={{ labelWidth: 100 }}
      request={async (params, sort, filter) => {
        const sortField = Object.keys(sort)?.[0] || 'createTime';
        const sortOrder = sort?.[sortField] ?? 'descend';

        const { data, code } = await searchOperationLogByPage({
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

export default OperationLog;
