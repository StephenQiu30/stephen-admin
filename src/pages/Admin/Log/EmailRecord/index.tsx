import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteRecord1, listRecordByPage1 } from '@/services/log/emailRecordController';
import { EmailStatusEnumMap } from '@/enums/EmailStatusEnum';
import ViewEmailRecordModal from './components/ViewEmailRecordModal';

/**
 * 邮件记录页面
 */
const EmailRecord: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<API.EmailRecordVO[]>([]);

    const handleDelete = async (record: API.EmailRecordVO) => {
        const hide = message.loading('正在删除');
        try {
            await deleteRecord1({
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

    const handleBatchDelete = async (selectedRows: API.EmailRecordVO[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
            await Promise.all(
                selectedRows.map(async (row) => {
                    await deleteRecord1({ id: row.id as any });
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


    const columns: ProColumns<API.EmailRecordVO>[] = [
        { title: '记录ID', dataIndex: 'id', width: 120, copyable: true, hideInSearch: true },
        { title: '消息ID', dataIndex: 'msgId', width: 120, ellipsis: true, responsive: ['lg'] },
        { title: '收件人', dataIndex: 'toEmail', width: 180, copyable: true },
        { title: '主题', dataIndex: 'subject', ellipsis: true },
        {
            title: '业务类型',
            dataIndex: 'bizType',
            width: 100,
            render: (text) => text && <Tag color="blue">{text}</Tag>,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            valueEnum: EmailStatusEnumMap,
        },
        {
            title: '重试',
            dataIndex: 'retryCount',
            width: 80,
            hideInSearch: true,
            render: (count) => <Tag color={Number(count) > 0 ? 'warning' : 'default'}>{count}</Tag>,
        },
        {
            title: '发送时间',
            dataIndex: 'sendTime',
            valueType: 'dateTime',
            width: 160,
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size={'middle'}>
                    <ViewEmailRecordModal record={record}>
                        <Typography.Link>详情</Typography.Link>
                    </ViewEmailRecordModal>
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
            <ProTable<API.EmailRecordVO>
                headerTitle="邮件记录"
                actionRef={actionRef}
                rowKey="id"
                search={{ labelWidth: 100 }}
                request={async (params, sort, filter) => {
                    const sortField = Object.keys(sort)?.[0] || 'createTime';
                    const sortOrder = sort?.[sortField] ?? 'descend';

                    const { data, code } = await listRecordByPage1({
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
                scroll={{ x: 1200 }}
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

export default EmailRecord;
