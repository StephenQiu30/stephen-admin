import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Tag } from 'antd';
import React, { useRef } from 'react';
import { deleteRecord } from '@/services/log/fileUploadRecordController';
import { searchFileUploadRecordByPage } from '@/services/search/searchController';

/**
 * 文件日志页面
 * 仅用于查看和删除文件记录
 */
const FileLog: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * 删除文件记录
   * @param record
   */
  const handleDeleteRecord = async (record: API.FileUploadRecordVO) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteRecord({
        id: record.id as any,
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

  const columns: ProColumns<API.FileUploadRecordVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      width: 150,
      copyable: true,
    },
    {
      title: '文件名',
      dataIndex: 'originalFilename',
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确认删除该记录？"
          onConfirm={() => handleDeleteRecord(record)}
          okText="是"
          cancelText="否"
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
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
        const sortField = Object.keys(sort)?.[0] || 'createTime';
        const sortOrder = sort?.[sortField] ?? 'descend';

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
