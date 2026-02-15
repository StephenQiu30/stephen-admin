import { ActionType } from '@ant-design/pro-components';
import { message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import React from 'react';

/**
 * 驼峰转蛇形命名
 * @param str
 */
export const camelToSnake = (str: string) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * 通用 响应 结构
 */
interface ApiResponse<T> {
    code?: number;
    data?: T;
    message?: string;
}

/**
 * 分页数据 结构
 */
interface PageData<T> {
    records?: T[];
    total?: number | string;
    [key: string]: any;
}

/**
 * 通用 ProTable request 封装
 * @param serviceApi 对应的服务接口函数
 * @param defaultSortField 默认排序字段
 */
export const wrapProTableRequest = async <T, U>(
    serviceApi: (params: U) => Promise<ApiResponse<PageData<T>> | any>,
    params: any,
    sort: Record<string, SortOrder>,
    filter: any,
    defaultSortField: string = 'update_time',
) => {
    const sortFieldCamel = Object.keys(sort)?.[0] || defaultSortField;
    const sortOrder = sort?.[sortFieldCamel] === 'ascend' ? 'ascend' : 'descend';

    // 驼峰转蛇形，解决数据库字段匹配问题
    const sortField = camelToSnake(sortFieldCamel);

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
 * 通用操作处理（删除、批量操作等）
 * @param action 操作函数
 * @param successText 成功提示文字
 */
export const handleOperation = async <T>(
    action: () => Promise<ApiResponse<T> | any>,
    successText: string = '操作成功',
) => {
    const hide = message.loading('正在处理');
    try {
        const res = await action();
        // 这里的判断逻辑根据后端接口设计调整，通常是 code === 0
        if (res.code === 0) {
            message.success(successText);
            return true;
        } else {
            message.error(`操作失败: ${res.message || '未知错误'}`);
            return false;
        }
    } catch (error: any) {
        message.error(`操作失败: ${error.message || '网络错误'}`);
        return false;
    } finally {
        hide();
    }
};

/**
 * 通用删除处理
 * @param action 删除接口
 * @param id 主键ID
 * @param successText 成功提示
 * @param actionRef 表格引用，用于刷新
 */
export const handleDelete = async (
    action: (params: { id: any }) => Promise<ApiResponse<boolean> | any>,
    id: any,
    successText: string = '删除成功',
    actionRef?: React.MutableRefObject<ActionType | undefined>,
) => {
    if (!id) return false;
    const success = await handleOperation(() => action({ id }), successText);
    if (success && actionRef) {
        actionRef.current?.reload();
    }
    return success;
};

/**
 * 通用批量删除处理
 * @param action 删除接口
 * @param selectedRows 选中的行数据
 * @param successText 成功提示
 * @param actionRef 表格引用，用于刷新
 * @param setSelectedRows 刷新选中行状态
 */
export const handleBatchDelete = async <T extends { id?: any }>(
    action: (params: { id: any }) => Promise<ApiResponse<boolean> | any>,
    selectedRows: T[],
    successText: string = '批量删除成功',
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    setSelectedRows?: (rows: T[]) => void,
) => {
    if (!selectedRows || selectedRows.length === 0) return false;
    const success = await handleOperation(async () => {
        await Promise.all(
            selectedRows.map(async (row) => {
                await action({ id: row.id });
            }),
        );
        return { code: 0, data: true };
    }, successText);

    if (success) {
        actionRef?.current?.reloadAndRest?.();
        setSelectedRows?.([]);
    }
    return success;
};
