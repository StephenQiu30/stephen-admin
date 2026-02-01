import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Col, Grid, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { listPostVoByPage } from '@/services/stephen-backend/postController';
import { listUserByPage } from '@/services/stephen-backend/userController';

const { Statistic } = StatisticCard;

const { useBreakpoint } = Grid;

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [userCount, setUserCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users count (pageSize 1 to minimize data transfer)
      const userRes = await listUserByPage({ pageSize: 1 });
      if (userRes?.data) {
        setUserCount(userRes.data.total || 0);
      }

      // Fetch posts count
      const postRes = await listPostVoByPage({ pageSize: 1 });
      if (postRes?.data) {
        setPostCount(postRes.data.total || 0);
      }
    } catch (e) {
      console.error('Fetch dashboard data failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      content={
        <Typography.Title level={4}>
          欢迎回来，{currentUser?.userName}！
        </Typography.Title>
      }
    >
      <ProCard split={isMobile ? 'horizontal' : 'vertical'} bordered headerBordered>
        <StatisticCard.Group direction={isMobile ? 'column' : 'row'}>
          <StatisticCard
            statistic={{
              title: '总用户数',
              value: userCount,
              loading: loading,
            }}
          />
          <StatisticCard.Divider />
          <StatisticCard
            statistic={{
              title: '总帖子数',
              value: postCount,
              loading: loading,
            }}
          />
          <StatisticCard.Divider />
          <StatisticCard
            statistic={{
              title: '当前时间',
              value: new Date().toLocaleDateString(),
            }}
          />
        </StatisticCard.Group>
      </ProCard>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="平台简介" bordered={false}>
            这是一个基于 Ant Design Pro 的后台管理平台。您可以在这里管理用户和帖子。
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
