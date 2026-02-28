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
  onSubmit: () => void;
}

/**
 * 常见弹窗
 * @param props
 * @constructor
 */
const CreatePostModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  // 帖子封面
  const [cover, setCover] = useState<string>();

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
      const hide = message.loading('正在上传封面...');
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(
          {
            fileUploadRequest: {
              biz: FileUploadBiz.POST_COVER,
            },
          },
          formData,
        );
        if (res.code === 0 && res.data?.url) {
          onSuccess(res.data);
          setCover(res.data.url);
          message.success('封面上传成功');
        } else {
          onError(new Error(res.message));
          message.error(`封面上传失败: ${res.message}`);
        }
      } catch (error: any) {
        onError(error);
        message.error(`文件上传失败: ${error.message}`);
      } finally {
        hide();
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
      if (!isImage) {
        message.error('只允许上传 JPG/PNG/WEBP 格式的图片!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!');
      }
      return isImage && isLt5M;
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
        try {
          const res = await addPost({
            ...values,
            cover,
            tags: values.tags,
          });
          if (res.code === 0 && res.data) {
            message.success('创建成功');
            onSubmit?.();
            return true;
          }
        } catch (error: any) {
          message.error(`创建失败: ${error.message}`);
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
          submitText: '新建帖子',
          resetText: '取消',
        },
      }}
    >
      <ProFormText name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]} />
      <ProForm.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
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
