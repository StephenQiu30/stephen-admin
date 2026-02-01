import { Avatar, Col, Grid, message, Row, UploadProps } from 'antd';
import React, { useState } from 'react';
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { AntDesignOutlined } from '@ant-design/icons';
import { FileUploadBiz } from '@/enums/FileUploadBizEnum';
import { updateUser } from '@/services/stephen-backend/userController';
import { uploadFile } from '@/services/stephen-backend/fileController';
import { useModel } from '@umijs/max';

interface BaseViewProps {
  user: API.UserVO;
}

const { useBreakpoint } = Grid;

/**
 * 个人基本信息
 * @param props
 * @constructor
 */
const BaseView: React.FC<BaseViewProps> = (props) => {
  const { user } = props;
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(user?.userAvatar);
  const scene = useBreakpoint();
  const isMobile = !scene.md;

  /**
   * 更新用户信息
   * @param values
   */
  const handleUpdate = async (values: API.UserUpdateRequest) => {
    const hide = message.loading('正在更新');
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
        userAvatar: userAvatar,
      });
      if (res.code === 0 && res.data) {
        hide();
        message.success('更新成功');
        // 刷新用户信息
        await refresh();
        return true;
      }
    } catch (error: any) {
      hide();
      message.error(`更新失败${error.message}, 请重试!`);
      return false;
    }
  };

  /**
   * 用户更新头像
   */
  const updateProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: async (options: any) => {
      const { onSuccess, onError, file } = options;
      try {
        const res = await uploadFile(
          {
            biz: FileUploadBiz.USER_AVATAR,
          },
          {
            file: file,
          },
        );
        if (res.code === 0 && res.data) {
          onSuccess(res.data);
          setUserAvatar(res.data);
        }
      } catch (error: any) {
        onError(error);
        message.error('文件上传失败', error.message);
      }
    },
    onRemove() {
      setUserAvatar(undefined);
    },
  };

  return (
    <ProCard
      title="更新个人基本信息"
      extra={isMobile ? null : new Date().toLocaleDateString()}
      headerBordered
      bodyStyle={{ padding: isMobile ? '4px' : '24px' }}
      headStyle={{ padding: isMobile ? '4px' : '24px' }}
    >
      <ProForm
        layout="vertical"
        onFinish={async (values) => {
          await handleUpdate(values);
        }}
        submitter={{
          searchConfig: {
            submitText: '更新用户信息',
            resetText: '重置用户信息',
          },
        }}
        initialValues={user}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <ProFormText name="userName" label="用户名" />
            <ProFormText name="userPhone" label="电话" />
            <ProFormText name="userEmail" label="邮箱" />
            <ProFormTextArea name="userProfile" label="简介" />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <Avatar
              size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 100, xxl: 120 }}
              icon={<AntDesignOutlined />}
              src={userAvatar}
              style={{ marginBottom: 16 }}
            />
            <ProFormUploadButton
              title={'上传头像'}
              max={1}
              fieldProps={{
                ...updateProps,
              }}
              name="pic"
              buttonProps={{
                type: 'default',
              }}
            />
          </Col>
        </Row>
      </ProForm>
    </ProCard>
  );
};
export default BaseView;
