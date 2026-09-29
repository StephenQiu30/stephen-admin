import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#0066cc',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Stephen Admin',
  pwa: true,
  logo: '/logo.svg',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    header: {
      colorBgHeader: '#1d1d1f',
      colorHeaderTitle: '#ffffff',
      colorTextMenu: '#d2d2d7',
      colorTextMenuSelected: '#2997ff',
    },
    sider: {
      colorMenuBackground: '#ffffff',
      colorTextMenu: '#1d1d1f',
      colorTextMenuSelected: '#0066cc',
    },
    pageContainer: {
      colorBgPageContainer: '#f5f5f7',
    },
  },
};

export default Settings;
