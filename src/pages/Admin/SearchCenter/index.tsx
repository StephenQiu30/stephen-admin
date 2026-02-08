import { PageContainer, ProCard, ProList, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Space, Tag, Avatar, Typography, Tabs } from 'antd';
import React, { useState } from 'react';
import { doSearchAll, searchPostByPage, searchUserByPage } from '@/services/search/searchController';

const { Link } = Typography;

const SearchCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchText, setSearchText] = useState<string>('');

    const renderUserItem = (item: any) => (
        <Space>
            <Avatar src={item.userAvatar} />
            <div>
                <div style={{ fontWeight: 'bold' }}>{item.userName}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.userProfile}</div>
            </div>
        </Space>
    );

    const renderPostItem = (item: any) => (
        <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.title}</div>
            <div style={{ color: '#666', marginTop: '4px' }}>{item.content?.substring(0, 100)}...</div>
            <div style={{ marginTop: '8px' }}>
                {item.tags?.map((tag: string) => <Tag key={tag}>{tag}</Tag>)}
            </div>
        </div>
    );

    return (
        <PageContainer title="聚合搜索中心" content="利用 Elasticsearch 提供的高性能搜索服务，对系统全量数据进行检索。">
            <ProCard>
                <ProForm
                    submitter={false}
                    onValuesChange={(_, values) => setSearchText(values.searchText)}
                >
                    <ProFormText
                        name="searchText"
                        placeholder="输入搜索关键词..."
                        fieldProps={{
                            size: 'large',
                            allowClear: true,
                        }}
                    />
                </ProForm>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'all',
                            label: '全部结果',
                            children: (
                                <ProList<any>
                                    request={async (params) => {
                                        if (!searchText) return { data: [], success: true };
                                        const res = await doSearchAll({
                                            ...params,
                                            searchText,
                                        });
                                        return {
                                            data: res.data?.dataList || [],
                                            success: res.code === 0,
                                        };
                                    }}
                                    rowKey="id"
                                    renderItem={(item) => (
                                        item.userName ? renderUserItem(item) : renderPostItem(item)
                                    )}
                                />
                            ),
                        },
                        {
                            key: 'post',
                            label: '文章列表',
                            children: (
                                <ProList<any>
                                    request={async (params) => {
                                        const res = await searchPostByPage({
                                            ...params,
                                            searchText,
                                        });
                                        return {
                                            data: res.data?.records || [],
                                            success: res.code === 0,
                                            total: res.data?.total,
                                        };
                                    }}
                                    rowKey="id"
                                    renderItem={renderPostItem}
                                />
                            ),
                        },
                        {
                            key: 'user',
                            label: '用户列表',
                            children: (
                                <ProList<any>
                                    request={async (params) => {
                                        const res = await searchUserByPage({
                                            ...params,
                                            searchText,
                                        });
                                        return {
                                            data: res.data?.records || [],
                                            success: res.code === 0,
                                            total: res.data?.total,
                                        };
                                    }}
                                    rowKey="id"
                                    renderItem={renderUserItem}
                                />
                            ),
                        },
                    ]}
                />
            </ProCard>
        </PageContainer>
    );
};

export default SearchCenter;
