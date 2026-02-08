import { message, UploadProps } from 'antd';
import React, { useState } from 'react';
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { MarkdownEditor } from '@/components';

import { FileUploadBiz } from '@/enums/FileUploadBizEnum';
import { uploadFile } from '@/services/file/fileController';
import { addPost } from '@/services/post/postController';

interface Props {
  onCancel: () => void;
  visible: boolean;
  onSubmit: () => Promise<void>;
}

/**
 * 创建帖子
 * @param values
 */
const handleAdd = async (values: API.PostAddRequest) => {
  const hide = message.loading('正在创建...');
  try {
    const res = await addPost(values);
    if (res.code === 0 && res.data) {
      message.success('请在个人中心查看我创建的帖子');
      return true;
    } else {
      message.error(`创建失败${res.message}`);
      return false;
    }
  } catch (error: any) {
    message.error(`创建失败${error.message}`);
    return false;
  } finally {
    hide();
  }
};

/**
 * 常见弹窗
 * @param props
 * @constructor
 */
const CreatePostModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  // 帖子封面
  const [cover, setCover] = useState<any>();

  const [form] = ProForm.useForm<API.PostAddRequest>();

  /**
   * 上传文章封面
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
            biz: FileUploadBiz.POST_COVER,
          },
          formData,
        );
        if (res.code === 0 && res.data) {
          // 清理表单状态
          form.resetFields();
          onSuccess(res.data);
          setCover(res.data);
        }
      } catch (error: any) {
        onError(error);
        message.error('文件上传失败', error.message);
      }
    },
    onRemove() {
      setCover(undefined);
    },
  };
  return (
    <ModalForm
      open={visible}
      form={form}
      title={'新建帖子'}
      onFinish={async (values) => {
        const success = await handleAdd({
          ...values,
          cover,
          tags: values.tags,
        });
        if (success) {
          onSubmit?.();
        }
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
          submitText: '新建帖子',
          resetText: '取消',
        },
      }}
    >
      <ProFormText
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProForm.Item
        name="content"
        label="内容"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <MarkdownEditor />
      </ProForm.Item>
      <ProFormSelect
        name="tags"
        label="标签"
        mode="tags"
        placeholder="请输入标签"
        fieldProps={{
          suffixIcon: null,
        }}
      />
      <ProFormUploadDragger
        title={'上传帖子封面'}
        max={1}
        fieldProps={{
          ...uploadProps,
        }}
        name="cover"
        label={'封面'}
      />
    </ModalForm>
  );
};
export default CreatePostModal;
