import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { MarkdownEditor } from '@/components';
import { message, UploadProps } from 'antd';
import React, { useState } from 'react';

import { FileUploadBiz } from '@/enums/FileUploadBizEnum';
import { updatePost } from '@/services/post/postController';
import { uploadFile } from '@/services/file/fileController';

interface Props {
  oldData?: API.PostVO;
  onCancel: () => void;
  onSubmit: (values: API.PostUpdateRequest) => Promise<void>;
  visible: boolean;
}


/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.PostUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updatePost(fields);
    if (res.code === 0 && res.data) {
      message.success('更新成功');
      return true;
    } else {
      message.error(`更新失败${res.message}, 请重试!`);
      return false;
    }
  } catch (error: any) {
    message.error(`更新失败${error.message}, 请重试!`);
    return false;
  } finally {
    hide();
  }
};
const UpdatePostModal: React.FC<Props> = (props) => {
  const { oldData, visible, onSubmit, onCancel } = props;
  // 帖子封面
  const [cover, setCover] = useState<any>();


  const [form] = ProForm.useForm<API.PostUpdateRequest>();
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
          onSuccess(res.data);
          setCover(res.data);
        }
      } catch (error: any) {
        message.error('文件上传失败', error.message);
        onError(error);
      }
    },
    onRemove() {
      setCover(undefined);
    },
  };
  if (!oldData) {
    return null;
  }

  let tags: string[] = [];
  if (Array.isArray(oldData.tags)) {
    tags = oldData.tags;
  } else if (typeof oldData.tags === 'string') {
    try {
      tags = JSON.parse(oldData.tags);
    } catch (e) {
      tags = [];
    }
  }

  return (
    <ModalForm<API.PostUpdateRequest>
      title={'更新帖子信息'}
      open={visible}
      form={form}
      initialValues={{ ...oldData, tags }}
      onFinish={async (values: API.PostUpdateRequest) => {
        const success = await handleUpdate({
          ...values,
          id: oldData.id,
          cover: cover || oldData.cover,
          tags: values.tags,
        });
        if (success) {
          onSubmit?.(values);
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
          submitText: '更新帖子信息',
          resetText: '取消',
        },
      }}
    >
      <ProFormText
        initialValue={oldData?.title}
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
        initialValue={tags}
      />
      <ProFormUploadDragger
        title={'上传帖子封面'}
        max={1}
        fieldProps={{
          ...uploadProps,
        }}
        name="pic"
        label={'封面'}
      />
    </ModalForm>
  );
};
export default UpdatePostModal;
