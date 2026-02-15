
import { PageContainer, ProCard, ProForm, ProFormText, ProFormTextArea, ProFormSwitch, ProFormSelect, ProTable } from '@ant-design/pro-components';
import { message, Button, Tabs, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { sendMailAsync, sendMailSync } from '@/services/mail/mailController';
import { deleteRecord1 } from '@/services/log/emailRecordController';
import { searchEmailRecordByPage } from '@/services/search/searchController';
import { handleOperation, wrapProTableRequest } from '@/utils/tableUtils';

interface MailFormValues extends API.MailSendRequest {
    isAsync: boolean;
}

const MailTool: React.FC = () => {
    const [form] = ProForm.useForm<MailFormValues>();
    const actionRef = useRef<any>();

    const onFinish = async (values: MailFormValues) => {
        const success = await handleOperation(async () => {
            return values.isAsync
                ? await sendMailAsync(values)
                : await sendMailSync(values);
        }, '邮件发送成功');

        if (success) {
            form.resetFields();
        }
    };

    const handleDelete = async (record: API.EmailRecord) => {
        if (!record.id) return true;
        return await handleOperation(() => deleteRecord1({ id: record.id }), '删除成功');
    };

    const historyColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInForm: true,
            width: 80,
        },
        {
            title: '收件人',
            dataIndex: 'toEmail',
            copyable: true,
        },
        {
            title: '主题',
            dataIndex: 'subject',
            ellipsis: true,
        },
        {
            title: '内容',
            dataIndex: 'content',
            hideInSearch: true,
            ellipsis: true,
            width: 200,
        },
        {
            title: '失败原因',
            dataIndex: 'failureReason',
            hideInSearch: true,
            ellipsis: true,
            valueType: 'text',
            render: (text: any) => <span style={{ color: 'red' }}>{text}</span>,
        },
        {
            title: '发送时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            width: 160,
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_: any, record: any) => [
                <Popconfirm
                    key="delete"
                    title="确定删除这条记录吗?"
                    onConfirm={() => handleDelete(record)}
                    okText="是"
                    cancelText="否"
                >
                    <a style={{ color: 'red' }}>删除</a>
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer title="邮件工具" content="通过后台直接向用户发送系统邮件或测试邮件。">
            <ProCard>
                <Tabs
                    items={[
                        {
                            key: 'send',
                            label: '发送邮件',
                            children: (
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
                            ),
                        },
                        {
                            key: 'history',
                            label: '发送记录',
                            children: (
                                <ProTable
                                    headerTitle="邮件发送记录"
                                    actionRef={actionRef}
                                    rowKey="id"
                                    search={{
                                        labelWidth: 100,
                                    }}
                                    request={async (params, sort, filter) => {
                                        return await wrapProTableRequest(
                                            searchEmailRecordByPage,
                                            params,
                                            sort,
                                            filter,
                                        );
                                    }}
                                    // @ts-ignore
                                    columns={historyColumns}
                                />
                            ),
                        },
                    ]}
                />
            </ProCard>
        </PageContainer>
    );
};

export default MailTool;
