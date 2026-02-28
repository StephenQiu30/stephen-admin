import { Modal, Descriptions, Tag, Avatar, Space, Typography } from 'antd';
import React from 'react';
import { userRole } from '@/enums/UserRoleEnum';
import { EmailVerifiedEnumMap } from '@/enums/EmailVerifiedEnum';

interface Props {
    user?: API.User;
    visible: boolean;
    onCancel: () => void;
}

/**
 * 用户详情 Modal
 * @param props
 * @constructor
 */
const ViewUserModal: React.FC<Props> = (props) => {
    const { user, visible, onCancel } = props;

    return (
        <Modal
            title="用户详情"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="用户ID" span={1}>
                    <Typography.Text copyable>{user?.id}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="用户名" span={1}>
                    {user?.userName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="头像" span={1}>
                    {user?.userAvatar ? <Avatar src={user.userAvatar} size="large" /> : <Avatar size="large" />}
                </Descriptions.Item>
                <Descriptions.Item label="权限" span={1}>
                    <Tag color={user?.userRole === 'admin' ? 'pro' : 'default'}>
                        {user?.userRole ? userRole[user.userRole as keyof typeof userRole]?.text : '-'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="邮箱" span={1}>
                    {user?.userEmail || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱验证" span={1}>
                    {user?.emailVerified !== undefined ? (
                        <Tag color={EmailVerifiedEnumMap[user.emailVerified as keyof typeof EmailVerifiedEnumMap]?.status === 'Success' ? 'success' : 'error'}>
                            {EmailVerifiedEnumMap[user.emailVerified as keyof typeof EmailVerifiedEnumMap]?.text}
                        </Tag>
                    ) : (
                        '-'
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="手机号" span={1}>
                    {user?.userPhone || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="GitHub 账号" span={1}>
                    {user?.githubLogin ? (
                        <Typography.Link href={user.githubUrl} target="_blank">
                            {user.githubLogin}
                        </Typography.Link>
                    ) : (
                        '-'
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="个人简介" span={2}>
                    {user?.userProfile || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="最后登录 IP" span={1}>
                    {user?.lastLoginIp || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="最后登录时间" span={1}>
                    {user?.lastLoginTime || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={1}>
                    {user?.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间" span={1}>
                    {user?.updateTime}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ViewUserModal;
