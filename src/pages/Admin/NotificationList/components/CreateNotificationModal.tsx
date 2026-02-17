import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDependency,
} from '@ant-design/pro-components';
import React from 'react';
import { addNotification } from '@/services/notification/notificationController';
import { listUserVoByPage } from '@/services/user/userController';
import { ProForm } from '@ant-design/pro-components';
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
      title={'创建通知'}
      onFinish={async (values: any) => {
        const { sendMode, ...rest } = values;
        const hide = message.loading('正在处理');
        let success = false;
        try {
          const params: API.NotificationAddRequest = {
            title: rest.title,
            content: rest.content,
            // 默认类型为系统通知
            ...((rest.type) && { type: rest.type }),
          };

          if (sendMode === 'broadcast') {
            // 广播模式：target = "all"
            params.target = 'all';
          } else {
            // 个人模式：target = userId
            if (rest.userId) {
              params.target = String(rest.userId);
            }
          }
          const res = await addNotification(params);
          if (res.code === 0) {
            message.success('发送成功');
            success = true;
          } else {
            message.error(`发送失败: ${res.message}`);
          }
        } catch (error: any) {
          message.error(`操作失败: ${error.message}`);
        } finally {
          hide();
        }

        if (success) {
          onSubmit?.();
        }
        return success;
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          onCancel?.();
        },
      }}
      initialValues={{
        sendMode: 'individual',
      }}
    >
      <ProFormRadio.Group
        name="sendMode"
        label="发送模式"
        options={[
          { label: '个人通知', value: 'individual' },
          { label: '系统广播', value: 'broadcast' },
        ]}
        rules={[{ required: true }]}
      />
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
      <ProForm.Group>
        <ProFormDependency name={['sendMode']}>
          {({ sendMode }) => {
            if (sendMode === 'broadcast') return null;
            return (
              <>
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
              </>
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
    </ModalForm>
  );
};
export default CreateNotificationModal;

