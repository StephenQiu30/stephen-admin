/**
 * 将驼峰命名转换为蛇形命名
 * @param str 驼峰命名的字符串
 * @returns 蛇形命名的字符串
 */
export const toSnakeCase = (str: string): string => {
    if (!str) return str;
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};
