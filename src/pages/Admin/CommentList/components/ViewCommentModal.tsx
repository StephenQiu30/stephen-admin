import { Modal, Descriptions, Space, Typography, Avatar } from 'antd';
import React from 'react';

interface Props {
    comment?: API.PostCommentVO;
    visible: boolean;
    onCancel: () => void;
}

/**
 * 评论详情 Modal
 * @param props
 * @constructor
 */
const ViewCommentModal: React.FC<Props> = (props) => {
    const { comment, visible, onCancel } = props;

    return (
        <Modal
            title="评论详情"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="评论ID">
                    <Typography.Text copyable>{comment?.id}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="发布者">
                    <Space>
                        {comment?.userVO?.userAvatar && <Avatar src={comment.userVO.userAvatar} size="small" />}
                        <Typography.Text strong>{comment?.userVO?.userName || comment?.userId}</Typography.Text>
                        <Typography.Text type="secondary">(ID: {comment?.userId})</Typography.Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="帖子ID">
                    <Typography.Text copyable>{comment?.postId}</Typography.Text>
                </Descriptions.Item>
                {comment?.parentId && (
                    <Descriptions.Item label="父评论ID">
                        <Typography.Text copyable>{comment?.parentId}</Typography.Text>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="评论内容">
                    <div style={{ whiteSpace: 'pre-wrap' }}>{comment?.content || '-'}</div>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                    {comment?.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                    {comment?.updateTime}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ViewCommentModal;
