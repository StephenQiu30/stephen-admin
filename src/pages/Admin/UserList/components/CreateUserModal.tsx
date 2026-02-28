import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { message, UploadProps } from 'antd';
import React, { useState } from 'react';
import { userRole } from '@/enums/UserRoleEnum';
import { FileUploadBiz } from '@/enums/FileUploadBizEnum';
import { addUser } from '@/services/user/userController';
import { uploadFile } from '@/services/file/fileController';

interface Props {
  onCancel: () => void;
  onSubmit: (values: API.UserAddRequest) => Promise<void>;
  visible: boolean;
}

/**
 * 常见弹窗
 * @param props
 * @constructor
 */
const CreateUserModal: React.FC<Props> = (props) => {
  const { visible, onSubmit, onCancel } = props;
  // 用户头像
  const [userAvatar, setUserAvatar] = useState<string>();
  const [form] = ProForm.useForm<API.UserAddRequest>();
  /**
   * 用户更新头像
   */
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: async (options: any) => {
      const { onSuccess, onError, file } = options;
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
        if (res.code === 0 && res.data) {
          onSuccess(res.data);
          setUserAvatar(res.data.url);
        } else {
          onError(new Error(res.message));
          message.error(`文件上传失败: ${res.message}`);
        }
      } catch (error: any) {
        onError(error);
        message.error(`文件上传失败: ${error.message}`);
      }
    },
    onRemove() {
      setUserAvatar(undefined);
    },
  };

  return (
    <ModalForm
      title={'新建用户'}
      open={visible}
      form={form}
      onFinish={async (values: API.UserAddRequest) => {
        try {
          const res = await addUser({
            ...values,
            userAvatar,
          });
          if (res.code === 0 && res.data) {
            message.success('添加成功');
            onSubmit?.(values);
            return true;
          }
        } catch (error: any) {
          message.error(`添加失败: ${error.message}`);
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
          submitText: '新建用户',
          resetText: '取消',
        },
      }}
    >
      <ProFormText
        name={'userName'}
        label={'用户名'}
        rules={[{ required: true, message: '请输入用户名' }]}
      />

      <ProFormText
        name={'userEmail'}
        label={'邮箱'}
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱' },
        ]}
      />
      <ProFormText
        name={'userPhone'}
        label={'电话'}
        rules={[{ pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}
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
export default CreateUserModal;
