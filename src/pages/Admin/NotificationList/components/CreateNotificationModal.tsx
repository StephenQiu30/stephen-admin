import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDependency,
} from '@ant-design/pro-components';
import React from 'react';
import { adminBroadcast, addNotification } from '@/services/notification/notificationController';
import { listUserVoByPage } from '@/services/user/userController';
import { ProForm } from '@ant-design/pro-components';
import { NotificationTypeEnum, NotificationTypeEnumMap } from '@/enums/NotificationTypeEnum';
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
          // 确保 type 存在
          if (!rest.type) {
            rest.type = NotificationTypeEnum.SYSTEM;
          }
          // 自动生成 bizId
          if (!rest.bizId) {
            rest.bizId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          }
          if (sendMode === 'broadcast') {
            // 广播不需要 userId 和 relatedInfo
            const broadcastParams = {
              title: rest.title,
              content: rest.content,
            };
            const res = await adminBroadcast(broadcastParams);
            if (res.code === 0) {
              message.success('广播成功');
              success = true;
            } else {
              message.error(`广播失败: ${res.message}`);
            }
          } else {
            const res = await addNotification(rest);
            if (res.code === 0) {
              message.success('发送成功');
              success = true;
            } else {
              message.error(`发送失败: ${res.message}`);
            }
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
        type: NotificationTypeEnum.SYSTEM,
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
                  name="type"
                  label="通知类型"
                  valueEnum={NotificationTypeEnumMap}
                  rules={[{ required: true, message: '请选择类型' }]}
                  fieldProps={{
                    allowClear: false,
                  }}
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
              </>
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
    </ModalForm>
  );
};
export default CreateNotificationModal;

