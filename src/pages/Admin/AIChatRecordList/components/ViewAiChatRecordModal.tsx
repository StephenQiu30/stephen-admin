import { ProDescriptions } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface Props {
  record?: API.AiChatRecordVO;
  visible: boolean;
  onCancel: () => void;
}

const ViewAiChatRecordModal: React.FC<Props> = (props) => {
  const { record, visible, onCancel } = props;

  return (
    <Modal
      title="对话详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <ProDescriptions<API.AiChatRecordVO>
        column={1}
        dataSource={record}
        columns={[
          { title: '用户 ID', dataIndex: 'userId', copyable: true },
          { title: '会话 ID', dataIndex: 'sessionId', copyable: true },
          { title: '模型类型', dataIndex: 'modelType' },
          { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime' },
          {
            title: '用户消息',
            dataIndex: 'message',
            valueType: 'textarea',
            ellipsis: true,
            copyable: true,
          },
          {
            title: 'AI 响应',
            dataIndex: 'response',
            valueType: 'textarea',
            ellipsis: true,
            copyable: true,
          },
        ]}
      />
    </Modal>
  );
};

export default ViewAiChatRecordModal;
