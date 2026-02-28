import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { message, UploadProps } from 'antd';
import React, { useState } from 'react';
import { userRole } from '@/enums/UserRoleEnum';
import { FileUploadBiz } from '@/enums/FileUploadBizEnum';
import { updateUser } from '@/services/user/userController';
import { uploadFile } from '@/services/file/fileController';

interface Props {
  oldData?: API.User;
  onCancel: () => void;
  onSubmit: (values?: API.UserUpdateRequest) => void;
  visible: boolean;
}

/**
 * 更新用户 Modal
 * @param props
 * @constructor
 */
const UpdateUserModal: React.FC<Props> = (props) => {
  const { oldData, visible, onSubmit, onCancel } = props;
  // 用户头像
  const [userAvatar, setUserAvatar] = useState<string>();
  const [form] = ProForm.useForm<API.UserUpdateRequest>();
  /**
   * 用户更新头像
   */
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: async (options: any) => {
      const { onSuccess, onError, file } = options;
      const hide = message.loading('正在上传头像...');
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(
          {
            fileUploadRequest: {
              biz: FileUploadBiz.USER_AVATAR,
            },
          },
          formData,
        );
        if (res.code === 0 && res.data?.url) {
          onSuccess(res.data);
          setUserAvatar(res.data.url);
          message.success('头像上传成功');
        } else {
          onError(new Error(res.message));
          message.error(`头像上传失败: ${res.message}`);
        }
      } catch (error: any) {
        onError(error);
        message.error(`文件上传失败: ${error.message}`);
      } finally {
        hide();
      }
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只允许上传 JPG/PNG 格式的图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('头像大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onRemove() {
      setUserAvatar(undefined);
    },
  };

  if (!oldData) {
    return <></>;
  }

  return (
    <ModalForm<API.UserUpdateRequest>
      title={'更新用户信息'}
      open={visible}
      form={form}
      initialValues={oldData}
      onFinish={async (values: API.UserUpdateRequest) => {
        try {
          const res = await updateUser({
            ...values,
            id: oldData?.id,
            userAvatar,
          });
          if (res.code === 0 && res.data) {
            message.success('更新成功');
            onSubmit?.(values);
            return true;
          }
        } catch (error: any) {
          message.error(`更新失败: ${error.message}`);
        }
        return false;
      }}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          onCancel?.();
        },
      }}
      submitter={{
        searchConfig: {
          submitText: '更新用户信息',
          resetText: '取消',
        },
      }}
    >
      <ProFormText
        name={'userName'}
        label={'用户名'}
        rules={[{ required: true, message: '请输入用户名' }]}
      />
      <ProFormTextArea name={'userProfile'} label={'简介'} />
      <ProFormText
        name={'userPhone'}
        label={'电话'}
        rules={[{ pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}
      />
      <ProFormText
        name={'userEmail'}
        label={'邮箱'}
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱' },
        ]}
      />
      <ProFormUploadDragger
        title={'上传头像'}
        label={'头像'}
        max={1}
        fieldProps={{
          ...uploadProps,
        }}
        name="pic"
      />
      <ProFormSelect
        name={'userRole'}
        label={'权限'}
        valueEnum={userRole}
        rules={[{ required: true, message: '请选择权限' }]}
      />
    </ModalForm>
  );
};
export default UpdateUserModal;
