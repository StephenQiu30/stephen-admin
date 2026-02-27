import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { addNotification } from '@/services/notification/notificationController';
import { message } from 'antd';

interface Props {
  onCancel: () => void;
  visible: boolean;
  onSubmit: () => Promise<void>;
}

const CreateNotificationModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSubmit } = props;

  return (
    <ModalForm
      open={visible}
      title={'创建系统通知'}
      onFinish={async (values: API.NotificationAddRequest) => {
        try {
          const res = await addNotification({
            ...values,
            target: 'all',
          });
          if (res.code === 0) {
            message.success('通知发送成功');
            onSubmit?.();
            return true;
          }
        } catch (error: any) {
          // 异常由全局处理
        }
        return false;
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
        placeholder="请输入跨系统广播的标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormTextArea
        name="content"
        label="通知内容"
        placeholder="请输入广播的具体内容"
        rules={[{ required: true, message: '请输入内容' }]}
      />
    </ModalForm>
  );
};
export default CreateNotificationModal;
