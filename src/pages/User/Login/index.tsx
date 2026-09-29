import { Footer } from '@/components';
import { LoginForm } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Card, Image, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { createStyles } from 'antd-style';
import { STEPHEN_TITLE } from '@/constants';
import { EmailLoginPage } from '@/pages/User/Login/components';
import { userLoginByEmail } from '@/services/user/userController';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: token.colorBgLayout,
    },
    content: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      alignItems: 'center',
      gap: 24,
      width: '100%',
      maxWidth: 1160,
      boxSizing: 'border-box',
      margin: '0 auto',
      padding: '48px 24px 24px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: 16,
        padding: '16px',
      },
    },
    brandPanel: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 550,
      minWidth: 0,
      boxSizing: 'border-box',
      padding: 48,
      borderRadius: 18,
      backgroundColor: '#1d1d1f',
      color: '#fff',
      '@media (max-width: 768px)': {
        minHeight: 0,
        gap: 32,
        padding: 28,
      },
    },
    brandName: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: '#fff',
      fontSize: 16,
      fontWeight: 600,
    },
    brandTitle: {
      maxWidth: 450,
      margin: '0 0 16px !important',
      color: '#fff !important',
      fontSize: 'clamp(30px, 3.2vw, 44px) !important',
      fontWeight: 600,
      lineHeight: 1.16,
      letterSpacing: '-0.02em',
    },
    brandDescription: {
      maxWidth: 380,
      margin: '0 !important',
      color: '#cccccc !important',
      fontSize: 16,
      lineHeight: 1.55,
    },
    brandFoot: {
      color: '#a1a1a6',
      fontSize: 12,
      letterSpacing: '0.08em',
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
    loginCard: {
      width: '100%',
      minHeight: 550,
      minWidth: 0,
      borderColor: token.colorBorderSecondary,
      borderRadius: 18,
      backgroundColor: token.colorBgContainer,
      '& .ant-card-body': {
        display: 'flex',
        minHeight: 548,
        alignItems: 'center',
        padding: '48px clamp(24px, 4vw, 64px)',
      },
      '& .ant-pro-form-login-container': {
        width: '100%',
        minWidth: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      '& .ant-pro-form-login-container .ant-pro-form-login-main': {
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
      },
      '& .ant-btn-primary': {
        minHeight: 44,
        borderRadius: 9999,
      },
      '@media (max-width: 768px)': {
        minHeight: 0,
        '& .ant-card-body': {
          minHeight: 0,
          padding: '36px 24px',
        },
      },
    },
  };
});

/**
 * 登录页面
 * @constructor
 */
const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [redirected, setRedirected] = useState(false);
  const { styles } = useStyles();

  // 用户登录
  const handleLoginSubmit = async (values: API.UserEmailLoginRequest) => {
    const hide = message.loading('正在登录中..');
    try {
      const res = await userLoginByEmail({ ...values });
      if (res.code === 0 && res.data) {
        if (res.data.userRole !== 'admin') {
          message.error('无权限，仅管理员可登录！');
          return;
        }
        setInitialState({
          ...initialState,
          currentUser: res?.data,
        });
        localStorage.setItem('stephen-token', res?.data?.token || '');
        setRedirected(true);
        message.success('登录成功！');
      } else {
        message.error(`登录失败${res.message}, 请重试！`);
      }
    } catch (error: any) {
      message.error(`登录失败${error.message}, 请重试！`);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    if (redirected) {
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
    }
  }, [redirected]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.brandPanel} aria-label="Stephen Admin">
          <div className={styles.brandName}>
            <Image preview={false} width={40} alt="" src="/logo.svg" />
            <span>{STEPHEN_TITLE}</span>
          </div>
          <div>
            <Typography.Title level={1} className={styles.brandTitle}>
              为内容和社区，留出更好的管理空间。
            </Typography.Title>
            <Typography.Paragraph className={styles.brandDescription}>
              在一个清晰的工作台中管理用户、内容与系统记录。
            </Typography.Paragraph>
          </div>
          <span className={styles.brandFoot}>STEPHEN ADMIN</span>
        </section>
        <Card className={styles.loginCard} variant="outlined">
          <LoginForm
            title={
              <Typography.Title level={2} style={{ marginBottom: 0, fontWeight: 600 }}>
                欢迎回来
              </Typography.Title>
            }
            subTitle="使用管理员邮箱登录，继续管理工作。"
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleLoginSubmit(values as API.UserEmailLoginRequest);
            }}
          >
            <EmailLoginPage />
          </LoginForm>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
