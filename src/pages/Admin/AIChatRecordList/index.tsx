import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Space, Typography, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteAiChatRecord, listAiChatRecordVoByPage } from '@/services/ai/aiChatRecordController';
import ViewAiChatRecordModal from './components/ViewAiChatRecordModal';

/**
 * AI 对话管理列表
 * @constructor
 */
const AIChatRecordList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.AiChatRecordVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.AiChatRecordVO[]>([]);

  /**
   * 删除节点
   * @param row
   */
  const handleDelete = async (row: API.AiChatRecordVO) => {
    if (!row?.id) return;
    const hide = message.loading('正在删除');
    try {
      const res = await deleteAiChatRecord({ id: row.id as any });
      if (res.code === 0) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(`删除失败: ${res.message}`);
      }
    } catch (error: any) {
      message.error(`删除报错: ${error.message}`);
    } finally {
      hide();
    }
  };

  /**
   * 批量删除节点
   * @param selectedRows
   */
  const handleBatchDelete = async (selectedRows: API.AiChatRecordVO[]) => {
    if (!selectedRows?.length) return;
    const hide = message.loading('正在删除');
    try {
      const res = await Promise.all(
        selectedRows.map((row) => deleteAiChatRecord({ id: row.id as any })),
      );
      if (res.every((r) => r.code === 0)) {
        message.success('批量删除成功');
        actionRef.current?.reloadAndRest?.();
        setSelectedRows([]);
      } else {
        message.error('部分内容删除失败');
      }
    } catch (error: any) {
      message.error(`批量删除报错: ${error.message}`);
    } finally {
      hide();
    }
  };

  /**
   * 表格列定义
   */
  const columns: ProColumns<API.AiChatRecordVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '用户 ID',
      dataIndex: 'userId',
      valueType: 'text',
      width: 100,
    },
    {
      title: '会话 ID',
      dataIndex: 'sessionId',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '模型类型',
      dataIndex: 'modelType',
      valueType: 'text',
      width: 120,
    },
    {
      title: '消息内容',
      dataIndex: 'message',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '搜索内容',
      dataIndex: 'searchText',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            key="view"
            onClick={() => {
              setCurrentRow(record);
              setViewModalVisible(true);
            }}
          >
            详情
          </Typography.Link>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record)}
          >
            <Typography.Link key="delete" type="danger">
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<API.AiChatRecordVO, API.AiChatRecordQueryRequest>
        headerTitle="AI 对话管理"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0] || 'createTime';
          const sortOrder = sort?.[sortField] ?? 'descend';

          const { data, code } = await listAiChatRecordVoByPage({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.AiChatRecordQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Popconfirm
              title="确定批量删除？"
              onConfirm={() => handleBatchDelete(selectedRowsState)}
            >
              <Typography.Link type="danger">批量删除</Typography.Link>
            </Popconfirm>
          </Space>
        )}
        scroll={{ x: 'max-content' }}
      />
      
      <ViewAiChatRecordModal
        visible={viewModalVisible}
        record={currentRow}
        onCancel={() => {
          setViewModalVisible(false);
          setCurrentRow(undefined);
        }}
      />
    </>
  );
};

export default AIChatRecordList;
