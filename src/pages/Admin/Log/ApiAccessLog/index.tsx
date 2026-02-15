import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { searchApiAccessLogByPage } from '@/services/search/searchController';
import { SortOrder } from 'antd/lib/table/interface';

/**
 * 驼峰转蛇形命名
 */
const camelToSnake = (str: string) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * 通用 ProTable request 封装
 */
const wrapProTableRequest = async <U,>(
    serviceApi: (params: U) => Promise<any>,
    params: any,
    sort: Record<string, SortOrder>,
    filter: any,
    defaultSortField: string = 'update_time',
    options?: { isEs?: boolean },
) => {
    const sortFieldCamel = Object.keys(sort)?.[0] || defaultSortField;
    const sortOrder = sort?.[sortFieldCamel] === 'ascend' ? 'ascend' : 'descend';
    const sortField = options?.isEs ? sortFieldCamel : camelToSnake(sortFieldCamel);
    const { data, code } = await serviceApi({
        ...params,
        ...filter,
        sortField,
        sortOrder,
    } as any);
    return {
        success: code === 0,
        data: data?.records || [],
        total: Number(data?.total) || 0,
    };
};

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
                    searchApiAccessLogByPage,
                    params,
                    sort,
                    filter,
                    'createTime',
                    { isEs: true },
                );
            }}
            columns={columns}
        />
    );
};

export default ApiAccessLog;
