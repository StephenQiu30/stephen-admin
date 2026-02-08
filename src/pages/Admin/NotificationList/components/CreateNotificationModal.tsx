import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { addNotification } from '@/services/notification/notificationController';

interface Props {
    onCancel: () => void;
    visible: boolean;
    onSubmit: () => Promise<void>;
}

/**
 * 发送通知
 * @param values
 */
const handleAdd = async (values: API.NotificationAddRequest) => {
    const hide = message.loading('正在发送...');
    try {
        const res = await addNotification(values);
        if (res.code === 0 && res.data) {
            message.success('发送成功');
            return true;
        } else {
            message.error(`发送失败${res.message}`);
            return false;
        }
    } catch (error: any) {
        message.error(`发送失败${error.message}`);
        return false;
    } finally {
        hide();
    }
};

const CreateNotificationModal: React.FC<Props> = (props) => {
    const { visible, onCancel, onSubmit } = props;

    return (
        <ModalForm
            open={visible}
            title={'发送系统通知'}
            onFinish={async (values) => {
                const success = await handleAdd(values);
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
            <ProFormText
                name="userId"
                label="接收用户ID"
                placeholder="输入接收人的用户ID（不填可能代表系统公告）"
            />
            <ProFormText name="relatedType" label="关联类型" placeholder="例如：POST, COMMENT" />
            <ProFormText name="relatedId" label="关联ID" placeholder="关联对象的唯一标识" />
        </ModalForm>
    );
};
export default CreateNotificationModal;
