import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useRef } from 'react';
import { searchFileUploadRecordByPage } from '@/services/search/searchController';
import { toSnakeCase } from '@/utils';

/**
 * 文件日志页面
 * 仅用于查看和删除文件记录
 */
const FileLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.FileUploadRecordVO>[] = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      valueType: 'text',
    },
    {
      title: '文件类型',
      dataIndex: 'fileSuffix',
      valueType: 'text',
      render: (_, record) => <Tag color="blue">{record.fileSuffix}</Tag>,
    },
    {
      title: '文件大小 (Bytes)',
      dataIndex: 'fileSize',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '文件地址',
      dataIndex: 'url',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          查看
        </a>
      ),
    },
    {
      title: '上传者 ID',
      dataIndex: 'userId',
      valueType: 'text',
      copyable: true,
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      width: 180,
      sorter: true,
    },
  ];

  return (
    <ProTable<API.FileUploadRecordVO>
      headerTitle="文件日志"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 120,
      }}
      request={async (params, sort, filter) => {
        const sortFieldCamel = Object.keys(sort)?.[0] || 'createTime';
        const sortField = toSnakeCase(sortFieldCamel);
        const sortOrder = sort?.[sortFieldCamel] ?? 'descend';

        const { data, code } = await searchFileUploadRecordByPage({
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

export default FileLog;
