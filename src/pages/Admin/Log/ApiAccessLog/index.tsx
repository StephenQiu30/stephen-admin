import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { listLogByPage2 } from '@/services/log/apiAccessLogController';
import { wrapProTableRequest } from '@/utils/tableUtils';

/**
 * API 访问日志页面
 */
const ApiAccessLog: React.FC = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<API.ApiAccessLogVO>[] = [
        { title: 'ID', dataIndex: 'id', width: 80, hideInForm: true },
        { title: '用户ID', dataIndex: 'userId', width: 100 },
        { title: '请求方式', dataIndex: 'method', width: 80 },
        { title: '请求路径', dataIndex: 'path', ellipsis: true },
        { title: '响应状态', dataIndex: 'status', width: 80 },
        { title: '耗时 (ms)', dataIndex: 'latencyMs', width: 100, hideInSearch: true },
        { title: 'IP地址', dataIndex: 'clientIp', width: 120, hideInSearch: true },
        { title: '时间', dataIndex: 'createTime', valueType: 'dateTime', width: 160, hideInSearch: true, sorter: true },
    ];

    return (
        <ProTable<API.ApiAccessLogVO>
            headerTitle="API 访问日志"
            actionRef={actionRef}
            rowKey="id"
            search={{ labelWidth: 100 }}
            request={async (params, sort, filter) => {
                return await wrapProTableRequest(
                    listLogByPage2,
                    params,
                    sort,
                    filter,
                );
            }}
            columns={columns}
        />
    );
};

export default ApiAccessLog;
