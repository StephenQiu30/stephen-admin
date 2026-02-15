import {
    ActionType,
    FooterToolbar,
    ProColumns,
    ProTable,
} from '@ant-design/pro-components';
import { Avatar, Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { deletePostComment, listPostCommentByPage } from '@/services/post/postCommentController';
import { handleBatchDelete, handleDelete, wrapProTableRequest } from '@/utils/tableUtils';

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
