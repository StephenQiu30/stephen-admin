import {
    ModalForm,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';
import { adminBroadcast } from '@/services/notification/notificationController';
import { message } from 'antd';

interface Props {
    visible: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

const BroadcastNotificationModal: React.FC<Props> = (props) => {
    const { visible, onCancel, onSubmit } = props;

    return (
        <ModalForm
            title={'系统广播'}
            open={visible}
            onFinish={async (values: any) => {
                const hide = message.loading('正在广播');
                try {
                    const res = await adminBroadcast(values);
                    if (res.code === 0) {
                        message.success('广播成功');
                        onSubmit?.();
                        return true;
                    } else {
                        message.error(`广播失败: ${res.message}`);
                        return false;
                    }
                } catch (error: any) {
                    message.error(`广播失败: ${error.message}`);
                    return false;
                } finally {
                    hide();
                }
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => onCancel?.(),
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
        </ModalForm>
    );
};

export default BroadcastNotificationModal;
