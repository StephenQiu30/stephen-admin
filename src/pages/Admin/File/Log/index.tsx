import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { deleteRecord } from '@/services/log/fileUploadRecordController';
import { searchFileUploadRecordByPage } from '@/services/search/searchController';
import { SortOrder } from 'antd/lib/table/interface';

/**
 * 驼峰转蛇形命名
 */
const camelToSnake = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * 通用 ProTable request 封装
 */
const wrapProTableRequest = async <U,>(
  serviceApi: (params: U) => Promise<any>,
  params: any,
  sort: Record<string, SortOrder>,
  filter: any,
  defaultSortField: string = 'update_time',
  options?: { isEs?: boolean },
) => {
  const sortFieldCamel = Object.keys(sort)?.[0] || defaultSortField;
  const sortOrder = sort?.[sortFieldCamel] === 'ascend' ? 'ascend' : 'descend';
  const sortField = options?.isEs ? sortFieldCamel : camelToSnake(sortFieldCamel);
  const { data, code } = await serviceApi({
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
};

/**
 * 通用操作处理
 */
const handleOperation = async (action: () => Promise<any>, successText: string = '操作成功') => {
  const hide = message.loading('正在处理');
  try {
    const res = await action();
    if (res.code === 0) {
      message.success(successText);
      return true;
    } else {
      message.error(`操作失败: ${res.message || '未知错误'}`);
      return false;
    }
  } catch (error: any) {
    message.error(`操作失败: ${error.message || '网络错误'}`);
    return false;
  } finally {
    hide();
  }
};

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
  const handleDelete = async (record: API.FileUploadRecordVO) => {
    if (!record.id) return true;
    const success = await handleOperation(() => deleteRecord({ id: record.id }), '删除成功');
    if (success) {
      actionRef.current?.reload();
    }
    return success;
  };

  const columns: ProColumns<API.FileUploadRecordVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      width: 150,
    },
    {
      title: '文件名',
      dataIndex: 'originalFilename',
      valueType: 'text',
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      valueType: 'text',
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
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
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
          onConfirm={() => handleDelete(record)}
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
        return await wrapProTableRequest(
          searchFileUploadRecordByPage,
          params,
          sort,
          filter,
          'createTime',
          { isEs: true },
        );
      }}
      columns={columns}
    />
  );
};

export default FileLog;
