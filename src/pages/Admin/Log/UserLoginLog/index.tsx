import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { listLogByPage } from '@/services/log/userLoginLogController';
import { wrapProTableRequest } from '@/utils/tableUtils';

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
                    listLogByPage,
                    params,
                    sort,
                    filter,
                );
            }}
            columns={columns}
        />
    );
};

export default UserLoginLog;
