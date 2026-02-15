import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { listLogByPage1 } from '@/services/log/operationLogController';
import { wrapProTableRequest } from '@/utils/tableUtils';

/**
 * 操作日志页面
 */
const OperationLog: React.FC = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<API.OperationLogVO>[] = [
        { title: 'ID', dataIndex: 'id', width: 80, hideInForm: true },
        { title: '操作者ID', dataIndex: 'operatorId', width: 100 },
        { title: '模块', dataIndex: 'module', width: 120 },
        { title: '操作类型', dataIndex: 'action', width: 100 },
        { title: '操作方法', dataIndex: 'method', width: 150, ellipsis: true, hideInSearch: true },
        { title: '响应状态', dataIndex: 'responseStatus', width: 80 },
        { title: '操作时间', dataIndex: 'createTime', valueType: 'dateTime', width: 160, hideInSearch: true, sorter: true },
    ];

    return (
        <ProTable<API.OperationLogVO>
            headerTitle="操作日志"
            actionRef={actionRef}
            rowKey="id"
            search={{ labelWidth: 100 }}
            request={async (params, sort, filter) => {
                return await wrapProTableRequest(
                    listLogByPage1,
                    params,
                    sort,
                    filter,
                );
            }}
            columns={columns}
        />
    );
};

export default OperationLog;
