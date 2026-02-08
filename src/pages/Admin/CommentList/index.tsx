import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Space, Typography, Avatar } from 'antd';
import React, { useRef } from 'react';
import { deletePostComment, listPostCommentVoByPage } from '@/services/post/postCommentController';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
        const res = await deletePostComment({
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

/**
 * 评论管理列表
 * @constructor
 */
const CommentList: React.FC = () => {
    const actionRef = useRef<ActionType>();

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
            hideInSearch: true,
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
                            await handleDelete(record);
                            actionRef.current?.reload();
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
        <ProTable<API.PostCommentVO, API.PageParams>
            headerTitle={'评论列表'}
            actionRef={actionRef}
            rowKey={'id'}
            search={{
                labelWidth: 120,
            }}
            request={async (params, sort, filter) => {
                const sortField = Object.keys(sort)?.[0];
                const sortOrder = sort?.[sortField] ?? undefined;
                const { data, code } = await listPostCommentVoByPage({
                    ...params,
                    ...filter,
                    sortField,
                    sortOrder,
                } as API.PostCommentQueryRequest);

                return {
                    success: code === 0,
                    data: data?.records || [],
                    total: data?.total || 0,
                };
            }}
            columns={columns}
        />
    );
};
export default CommentList;
