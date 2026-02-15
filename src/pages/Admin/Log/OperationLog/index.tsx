import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { searchOperationLogByPage } from '@/services/search/searchController';
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
                    searchOperationLogByPage,
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

export default OperationLog;
