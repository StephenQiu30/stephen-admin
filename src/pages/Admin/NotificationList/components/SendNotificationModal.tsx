import {
    ModalForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';
import { addNotification } from '@/services/notification/notificationController';
import { listUserVoByPage } from '@/services/user/userController';
import { NotificationTypeEnum, NotificationTypeEnumMap } from '@/enums/NotificationTypeEnum';
import { message } from 'antd';

interface Props {
    visible: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

const SendNotificationModal: React.FC<Props> = (props) => {
    const { visible, onCancel, onSubmit } = props;

    return (
        <ModalForm
            title={'发送通知'}
            open={visible}
            onFinish={async (values: any) => {
                const hide = message.loading('正在发送');
                try {
                    // 确保 type 存在
                    if (!values.type) {
                        values.type = NotificationTypeEnum.SYSTEM;
                    }
                    // 自动生成 bizId
                    if (!values.bizId) {
                        values.bizId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    }

                    const res = await addNotification(values);
                    if (res.code === 0) {
                        message.success('发送成功');
                        onSubmit?.();
                        return true;
                    } else {
                        message.error(`发送失败: ${res.message}`);
                        return false;
                    }
                } catch (error: any) {
                    message.error(`发送失败: ${error.message}`);
                    return false;
                } finally {
                    hide();
                }
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => onCancel?.(),
            }}
            initialValues={{
                type: NotificationTypeEnum.SYSTEM,
            }}
        >
            <ProFormText
                name="title"
                label="通知标题"
                rules={[{ required: true, message: '请输入标题' }]}
            />
            <ProFormTextArea
                name="content"
                label="通知内容"
                rules={[{ required: true, message: '请输入内容' }]}
            />
            <ProFormSelect
                name="type"
                label="通知类型"
                valueEnum={NotificationTypeEnumMap}
                rules={[{ required: true, message: '请选择类型' }]}
            />
            <ProFormSelect
                name="userId"
                label="接收用户"
                showSearch
                debounceTime={500}
                placeholder="搜索并选择用户"
                request={async ({ keywords }) => {
                    const res = await listUserVoByPage({
                        userName: keywords,
                        current: 1,
                        pageSize: 10,
                    });
                    return (res.data?.records || []).map((u: any) => ({
                        label: `${u.userName} (${u.userAccount})`,
                        value: u.id,
                    }));
                }}
                rules={[{ required: true, message: '请选择接收用户' }]}
            />
            <ProFormSelect
                name="relatedType"
                label="关联类型"
                options={[
                    { label: '无', value: '' },
                    { label: '帖子', value: 'post' },
                    { label: '评论', value: NotificationTypeEnum.COMMENT },
                    { label: '系统', value: NotificationTypeEnum.SYSTEM },
                ]}
            />
            <ProFormText name="relatedId" label="关联ID" placeholder="关联对象的唯一标识" />
        </ModalForm>
    );
};

export default SendNotificationModal;
