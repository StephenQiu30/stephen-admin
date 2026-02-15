import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import { deleteRecord, listRecordByPage } from '@/services/log/fileUploadRecordController';
import { handleOperation, wrapProTableRequest } from '@/utils/tableUtils';

/**
 * 文件日志页面
 * 仅用于查看和删除文件记录
 */
const FileLog: React.FC = () => {
    const actionRef = useRef<ActionType>();

    /**
     * 删除文件记录
     * @param record
     */
    const handleDelete = async (record: API.FileUploadRecordVO) => {
        if (!record.id) return true;
        const success = await handleOperation(() => deleteRecord({ id: record.id }), '删除成功');
        if (success) {
            actionRef.current?.reload();
        }
        return success;
    };

    const columns: ProColumns<API.FileUploadRecordVO>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            valueType: 'text',
            hideInForm: true,
            width: 150,
        },
        {
            title: '文件名',
            dataIndex: 'originalFilename',
            valueType: 'text',
        },
        {
            title: '文件类型',
            dataIndex: 'fileType',
            valueType: 'text',
        },
        {
            title: '文件大小 (Bytes)',
            dataIndex: 'fileSize',
            valueType: 'digit',
            hideInSearch: true,
        },
        {
            title: '文件地址',
            dataIndex: 'url',
            valueType: 'text',
            hideInSearch: true,
            render: (_, record) => (
                <a href={record.url} target="_blank" rel="noopener noreferrer">
                    查看
                </a>
            ),
        },
        {
            title: '上传者 ID',
            dataIndex: 'userId',
            valueType: 'text',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Popconfirm
                    key="delete"
                    title="确认删除该记录？"
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
        <ProTable<API.FileUploadRecordVO>
            headerTitle="文件日志"
            actionRef={actionRef}
            rowKey="id"
            search={{
                labelWidth: 120,
            }}
            request={async (params, sort, filter) => {
                return await wrapProTableRequest(
                    listRecordByPage,
                    params,
                    sort,
                    filter,
                );
            }}
            columns={columns}
        />
    );
};

export default FileLog;
