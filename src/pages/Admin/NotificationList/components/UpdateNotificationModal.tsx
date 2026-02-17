import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';
import { updateNotification } from '@/services/notification/notificationController';
import { listUserVoByPage } from '@/services/user/userController';
import { message } from 'antd';
import { NotificationTypeEnumMap } from '@/enums/NotificationTypeEnum';

interface Props {
  oldData?: API.Notification;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  visible: boolean;
}

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
        const hide = message.loading('正在更新');
        let success = false;
        try {
          const res = await updateNotification({
            ...values,
            id: oldData.id,
          });
          if (res.code === 0) {
            message.success('更新成功');
            success = true;
          } else {
            message.error(`更新失败: ${res.message}`);
          }
        } catch (error: any) {
          message.error(`更新失败: ${error.message}`);
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
          { label: '帖子', value: 'POST' },
          { label: '评论', value: 'COMMENT' },
          { label: '系统', value: 'SYSTEM' },
        ]}
      />
      <ProFormText name="relatedId" label="关联ID" />
    </ModalForm>
  );
};
export default UpdateNotificationModal;
