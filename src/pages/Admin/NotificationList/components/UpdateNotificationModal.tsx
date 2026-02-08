import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { updateNotification } from '@/services/notification/notificationController';

interface Props {
    oldData?: API.Notification;
    onCancel: () => void;
    onSubmit: () => Promise<void>;
    visible: boolean;
}

/**
 * 更新通知
 *
 * @param fields
 */
const handleUpdate = async (fields: API.NotificationUpdateRequest) => {
    const hide = message.loading('正在更新');
    try {
        const res = await updateNotification(fields);
        if (res.code === 0 && res.data) {
            message.success('更新成功');
            return true;
        } else {
            message.error(`更新失败${res.message}, 请重试!`);
            return false;
        }
    } catch (error: any) {
        message.error(`更新失败${error.message}, 请重试!`);
        return false;
    } finally {
        hide();
    }
};

const UpdateNotificationModal: React.FC<Props> = (props) => {
    const { oldData, visible, onSubmit, onCancel } = props;

    if (!oldData) {
        return null;
    }

    return (
        <ModalForm<API.NotificationUpdateRequest>
            title={'更新通知信息'}
            open={visible}
            initialValues={oldData}
            onFinish={async (values) => {
                const success = await handleUpdate({
                    ...values,
                    id: oldData.id,
                });
                if (success) {
                    onSubmit?.();
                }
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    onCancel?.();
                },
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
                valueEnum={{
                    SYSTEM: '系统通知',
                    POST: '帖子通知',
                    COMMENT: '评论通知',
                }}
                rules={[{ required: true, message: '请选择类型' }]}
            />
            <ProFormText name="userId" label="接收用户ID" />
            <ProFormText name="relatedType" label="关联类型" />
            <ProFormText name="relatedId" label="关联ID" />
        </ModalForm>
    );
};
export default UpdateNotificationModal;
