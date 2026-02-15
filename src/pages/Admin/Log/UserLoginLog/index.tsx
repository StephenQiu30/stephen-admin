import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { searchUserLoginLogByPage } from '@/services/search/searchController';
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
 * 登录日志页面
 */
const UserLoginLog: React.FC = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<API.UserLoginLogVO>[] = [
        { title: 'ID', dataIndex: 'id', width: 80, hideInForm: true },
        { title: '用户账号', dataIndex: 'account', width: 120 },
        { title: 'IP地址', dataIndex: 'clientIp', width: 120 },
        { title: '登录类型', dataIndex: 'loginType', width: 100 },
        { title: 'UserAgent', dataIndex: 'userAgent', width: 150, ellipsis: true, hideInSearch: true },
        { title: '登录状态', dataIndex: 'status', width: 80 },
        { title: '登录时间', dataIndex: 'createTime', valueType: 'dateTime', width: 160, hideInSearch: true, sorter: true },
    ];

    return (
        <ProTable<API.UserLoginLogVO>
            headerTitle="登录日志"
            actionRef={actionRef}
            rowKey="id"
            search={{ labelWidth: 100 }}
            request={async (params, sort, filter) => {
                return await wrapProTableRequest(
                    searchUserLoginLogByPage,
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

export default UserLoginLog;
