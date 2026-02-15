import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Result } from 'antd';
import React, { useState } from 'react';
import { setMenu } from '@/services/user/wxMpController';
import { handleOperation } from '@/utils/tableUtils';

const WeChatManager: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleSetMenu = async () => {
        setLoading(true);
        await handleOperation(() => setMenu(), '菜单同步成功');
        setLoading(false);
    };

    return (
        <PageContainer content="管理微信公众号的相关配置与操作">
            <ProCard title="公众号设置" headerBordered bordered>
                <Result
                    status="success"
                    title="微信公众号配置"
                    subTitle="您可以点击下方按钮同步自定义菜单到微信服务器"
                    extra={[
                        <Button
                            key="setMenu"
                            type="primary"
                            loading={loading}
                            onClick={handleSetMenu}
                        >
                            同步菜单
                        </Button>,
                    ]}
                />
            </ProCard>
        </PageContainer>
    );
};

export default WeChatManager;
