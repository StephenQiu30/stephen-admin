import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
    deleteNotification,
    listNotificationByPageAdmin,
} from '@/services/notification/notificationController';
import CreateNotificationModal from './components/CreateNotificationModal';
import UpdateNotificationModal from './components/UpdateNotificationModal';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
        const res = await deleteNotification({
            id: row.id,
        });
        if (res.code === 0 && res.data) {
            message.success('删除成功');
        } else {
            message.error(`删除失败${res.message}, 请重试!`);
        }
    } catch (error: any) {
        message.error(`删除失败${error.message}, 请重试!`);
    } finally {
        hide();
    }
};

const NotificationList: React.FC = () => {
    // 新建窗口的Modal框
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    // 更新窗口的Modal框
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.Notification>();
    const [selectedRowsState, setSelectedRows] = useState<API.Notification[]>([]);

    /**
     * 批量删除
     * @param selectedRows
     */
    const handleBatchDelete = async (selectedRows: API.Notification[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
            await Promise.all(
                selectedRows.map(async (row) => {
                    await deleteNotification({
                        id: row.id,
                    });
                }),
            );
            message.success('删除成功');
            actionRef.current?.reloadAndRest?.();
        } catch (error: any) {
            message.error(`删除失败${error.message}, 请重试!`);
        } finally {
            hide();
            setSelectedRows([]);
        }
    };

    /**
     * 表格列数据
     */
    const columns: ProColumns<API.Notification>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            valueType: 'text',
            hideInForm: true,
            copyable: true,
            ellipsis: true,
            width: 120,
        },
        {
            title: '标题',
            dataIndex: 'title',
            valueType: 'text',
            ellipsis: true,
        },
        {
            title: '内容',
            dataIndex: 'content',
            valueType: 'textarea',
            ellipsis: true,
        },
        {
            title: '通知类型',
            dataIndex: 'type',
            valueType: 'select',
            valueEnum: {
                SYSTEM: { text: '系统通知', status: 'Processing' },
                POST: { text: '帖子通知', status: 'Success' },
                COMMENT: { text: '评论通知', status: 'Warning' },
            },
        },
        {
            title: '接收用户ID',
            dataIndex: 'userId',
            valueType: 'text',
            width: 120,
        },
        {
            title: '已读状态',
            dataIndex: 'isRead',
            valueType: 'select',
            valueEnum: {
                0: { text: '未读', status: 'Error' },
                1: { text: '已读', status: 'Success' },
            },
        },
        {
            title: '关联类型',
            dataIndex: 'relatedType',
            valueType: 'text',
            responsive: ['md'],
        },
        {
            title: '关联ID',
            dataIndex: 'relatedId',
            valueType: 'text',
            responsive: ['md'],
        },
        {
            title: '创建时间',
            sorter: true,
            dataIndex: 'createTime',
            valueType: 'dateTime',
            hideInSearch: true,
            hideInForm: true,
            width: 180,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 120,
            render: (_, record) => (
                <Space size={'middle'}>
                    <Typography.Link
                        key={'update'}
                        onClick={() => {
                            setCurrentRow(record);
                            setUpdateModalVisible(true);
                        }}
                    >
                        修改
                    </Typography.Link>
                    <Popconfirm
                        title="确定删除？"
                        description="删除后将无法恢复?"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={async () => {
                            await handleDelete(record);
                            actionRef.current?.reload();
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
        <>
            <ProTable<API.Notification, API.NotificationQueryRequest>
                headerTitle={'通知列表'}
                actionRef={actionRef}
                rowKey={'id'}
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setCreateModalVisible(true);
                        }}
                    >
                        发送通知
                    </Button>,
                ]}
                request={async (params, sort, filter) => {
                    const sortField = Object.keys(sort)?.[0];
                    const sortOrder = sort?.[sortField] ?? undefined;
                    const { data, code } = await listNotificationByPageAdmin({
                        ...params,
                        ...filter,
                        sortField:
                            sortField === 'createTime'
                                ? 'create_time'
                                : sortField === 'updateTime'
                                    ? 'update_time'
                                    : sortField,
                        sortOrder,
                    } as API.NotificationQueryRequest);

                    return {
                        success: code === 0,
                        data: data?.records || [],
                        total: data?.total || 0,
                    };
                }}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
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
            <CreateNotificationModal
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onSubmit={async () => {
                    setCreateModalVisible(false);
                    actionRef.current?.reload();
                }}
            />
            <UpdateNotificationModal
                oldData={currentRow}
                visible={updateModalVisible}
                onCancel={() => setUpdateModalVisible(false)}
                onSubmit={async () => {
                    setUpdateModalVisible(false);
                    setCurrentRow(undefined);
                    actionRef.current?.reload();
                }}
            />
        </>
    );
};
export default NotificationList;
