import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteRecord } from '@/services/log/fileUploadRecordController';
import { searchFileUploadRecordByPage } from '@/services/search/searchController';

/**
 * 文件日志页面
 * 仅用于查看和删除文件记录
 */
const FileLog: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.FileUploadRecordVO[]>([]);

  /**
   * 删除记录
   * @param record
   */
  const handleDelete = async (record: API.FileUploadRecordVO) => {
    const hide = message.loading('正在删除');
    try {
      await deleteRecord({
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

  /**
   * 批量删除记录
   * @param selectedRows
   */
  const handleBatchDelete = async (selectedRows: API.FileUploadRecordVO[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await Promise.all(
        selectedRows.map(async (row) => {
          await deleteRecord({ id: row.id as any });
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size={'middle'}>
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
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        scroll={{ x: 800 }}
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

export default FileLog;
