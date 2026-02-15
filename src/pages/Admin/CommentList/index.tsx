import {
    ActionType,
    FooterToolbar,
    ProColumns,
    ProTable,
} from '@ant-design/pro-components';
import { Avatar, Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deletePostComment, listPostCommentByPage } from '@/services/post/postCommentController';
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
const handleOperation = async (
    action: () => Promise<any>,
    successText: string = '操作成功',
) => {
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
 * 通用删除处理
 */
const handleDelete = async (
    action: (params: { id: any }) => Promise<any>,
    id: any,
    successText: string = '删除成功',
    actionRef?: React.MutableRefObject<ActionType | undefined>,
) => {
    if (!id) return false;
    const success = await handleOperation(() => action({ id }), successText);
    if (success && actionRef) {
        actionRef.current?.reload();
    }
    return success;
};

/**
 * 通用批量删除处理
 */
const handleBatchDelete = async <T extends { id?: any }>(
    action: (params: { id: any }) => Promise<any>,
    selectedRows: T[],
    successText: string = '批量删除成功',
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    setSelectedRows?: (rows: T[]) => void,
) => {
    if (!selectedRows || selectedRows.length === 0) return false;
    const success = await handleOperation(async () => {
        await Promise.all(
            selectedRows.map(async (row) => {
                await action({ id: row.id });
            }),
        );
        return { code: 0, data: true };
    }, successText);

    if (success) {
        actionRef?.current?.reloadAndRest?.();
        setSelectedRows?.([]);
    }
    return success;
};

/**
 * 评论管理列表
 * @constructor
 */
const CommentList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<API.PostCommentVO[]>([]);

    /**
     * 表格列数据
     */
    const columns: ProColumns<API.PostCommentVO>[] = [
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
            title: '评论内容',
            dataIndex: 'content',
            valueType: 'text',
            ellipsis: true,
        },
        {
            title: '用户',
            dataIndex: 'userId',
            valueType: 'text',
            render: (_, record) => (
                <Space>
                    {record.userVO?.userAvatar && <Avatar src={record.userVO.userAvatar} size="small" />}
                    <span>{record.userVO?.userName || record.userId}</span>
                </Space>
            ),
        },
        {
            title: '帖子ID',
            dataIndex: 'postId',
            valueType: 'text',
            copyable: true,
            ellipsis: true,
            width: 120,
        },
        {
            title: '创建时间',
            sorter: true,
            dataIndex: 'createTime',
            valueType: 'dateTime',
            hideInForm: true,
            width: 180,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 100,
            render: (_, record) => (
                <Space size={'middle'}>
                    <Popconfirm
                        title="确定删除？"
                        description="删除后将无法恢复?"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={async () => {
                            await handleDelete(deletePostComment, record.id, '删除成功', actionRef);
                        }}
                    >
                        <Typography.Link
                            key={'delete'}
                            type={'danger'}
                        >
                            删除
                        </Typography.Link>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <ProTable<API.PostCommentVO, any>
                headerTitle={'评论列表'}
                actionRef={actionRef}
                rowKey={'id'}
                search={{
                    labelWidth: 120,
                }}
                request={async (params, sort, filter) => {
                    return await wrapProTableRequest(
                        listPostCommentByPage,
                        params,
                        sort,
                        filter,
                    );
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
                            await handleBatchDelete(deletePostComment, selectedRowsState, '批量删除成功', actionRef, setSelectedRows);
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
export default CommentList;
