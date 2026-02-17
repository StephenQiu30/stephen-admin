export enum NotificationTypeEnum {
    /**
     * 系统通知
     */
    SYSTEM = 'system',

    /**
     * 用户通知
     */
    USER = 'user',

    /**
     * 评论通知
     */
    COMMENT = 'comment',

    /**
     * 点赞通知
     */
    LIKE = 'like',

    /**
     * 关注通知
     */
    FOLLOW = 'follow',

    /**
     * 全员广播
     */
    BROADCAST = 'broadcast',
}

export const NotificationTypeEnumMap = {
    [NotificationTypeEnum.SYSTEM]: '系统通知',
    [NotificationTypeEnum.USER]: '用户通知',
    [NotificationTypeEnum.COMMENT]: '评论通知',
    [NotificationTypeEnum.LIKE]: '点赞通知',
    [NotificationTypeEnum.FOLLOW]: '关注通知',
    [NotificationTypeEnum.BROADCAST]: '全员广播',
};
