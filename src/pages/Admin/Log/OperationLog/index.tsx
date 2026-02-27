import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { searchOperationLogByPage } from '@/services/search/searchController';
import { OperationStatusEnumMap } from '@/enums/OperationStatusEnum';

/**
 * 操作日志页面
 */
const OperationLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

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
