import React, { useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { ACCOUNT_TITLE } from '@/constants';
import { Col, Grid, Row } from 'antd';
import { useModel } from '@@/exports';
import { MyFavourPostList, MyPostList, MyThumbPostList } from '@/pages/Account/Center/components';
import { UserCard } from '@/components';

const { useBreakpoint } = Grid;


/**
 * 个人中心
 * @constructor
 */
const AccountCenter: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const scene = useBreakpoint();
  const isMobile = !scene.md;
  const [tab, setTab] = useState('my-post');

  return (
    <PageContainer title={ACCOUNT_TITLE} breadcrumb={undefined}>
      <Row gutter={24}>
        <Col span={isMobile ? 24 : 7}>
          <UserCard user={currentUser ?? {}} loading={!currentUser} />
        </Col>
        <Col span={isMobile ? 24 : 17}>
          <ProCard
            bodyStyle={{ padding: 0 }}
            tabs={{
              tabPosition: 'top',
              activeKey: tab,
              size: 'large',
              items: [
                {
                  label: `我的帖子`,
                  key: 'my-post',
                  children: <div style={{ padding: 16 }}><MyPostList /></div>,
                },
                {
                  label: `我的收藏`,
                  key: 'my-favour',
                  children: <div style={{ padding: 16 }}><MyFavourPostList /></div>,
                },
                {
                  label: `我的点赞`,
                  key: 'my-thumb',
                  children: <div style={{ padding: 16 }}><MyThumbPostList /></div>,
                },
              ],
              onChange: (key) => {
                setTab(key);
              },
              tabBarStyle: {
                padding: '0 24px',
                background: '#fff',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }
            }}
            bordered={false}
            style={{
              boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)', // Custom subtle shadow
              borderRadius: 8,
              overflow: 'hidden',
              minHeight: 400
            }}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AccountCenter;
