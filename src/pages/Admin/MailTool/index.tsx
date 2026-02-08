import { PageContainer, ProCard, ProForm, ProFormText, ProFormTextArea, ProFormSwitch, ProFormSelect } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import React from 'react';
import { sendMailAsync, sendMailSync } from '@/services/mail/mailController';

interface MailFormValues extends API.MailSendRequest {
    isAsync: boolean;
}

const MailTool: React.FC = () => {
    const [form] = ProForm.useForm<MailFormValues>();

    const onFinish = async (values: MailFormValues) => {
        const hide = message.loading('正在发送邮件...');
        try {
            const res = values.isAsync
                ? await sendMailAsync(values)
                : await sendMailSync(values);

            if (res.code === 0 && res.data) {
                message.success('邮件发送成功');
                form.resetFields();
            } else {
                message.error(`邮件发送失败: ${res.message}`);
            }
        } catch (error: any) {
            message.error(`邮件发送失败: ${error.message}`);
        } finally {
            hide();
        }
    };

    return (
        <PageContainer title="邮件工具" content="通过后台直接向用户发送系统邮件或测试邮件。">
            <ProCard>
                <ProForm<API.MailSendRequest & { isAsync: boolean }>
                    form={form}
                    onFinish={onFinish}
                    submitter={{
                        searchConfig: {
                            submitText: '提交发送',
                        },
                        render: (props, doms) => {
                            return [
                                ...doms,
                                <Button key="reset" onClick={() => props.form?.resetFields()}>
                                    重置
                                </Button>,
                            ];
                        },
                    }}
                >
                    <ProFormText
                        name="to"
                        label="收件人邮箱"
                        placeholder="请输入收件人邮箱"
                        rules={[
                            { required: true, message: '请输入收件人邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                    />
                    <ProFormText
                        name="subject"
                        label="邮件主题"
                        placeholder="请输入邮件主题"
                        rules={[{ required: true, message: '请输入邮件主题' }]}
                    />
                    <ProFormTextArea
                        name="content"
                        label="邮件内容"
                        placeholder="请输入邮件内容（支持 HTML 如果勾选下方 HTML 模式）"
                        rules={[{ required: true, message: '请输入邮件内容' }]}
                    />
                    <ProForm.Group>
                        <ProFormSwitch name="isHtml" label="HTML 模式" />
                        <ProFormSwitch name="isAsync" label="异步发送" initialValue={true} />
                    </ProForm.Group>
                    <ProFormSelect
                        name="bizType"
                        label="业务类型 (可选)"
                        options={[
                            { label: '系统通知', value: 'SYSTEM' },
                            { label: '验证码', value: 'VERIFY_CODE' },
                            { label: '活动通知', value: 'ACTIVITY' },
                        ]}
                    />
                    <ProFormText
                        name="bizId"
                        label="业务ID (可选)"
                        placeholder="关联的业务条目 ID"
                    />
                </ProForm>
            </ProCard>
        </PageContainer>
    );
};

export default MailTool;
