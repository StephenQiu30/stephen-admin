import { Card, Flex, Typography } from 'antd';

type AdminPageHeaderProps = {
  title: string;
  description: string;
  category: string;
};

/** Shared introduction for the management screens. */
const AdminPageHeader = ({ title, description, category }: AdminPageHeaderProps) => (
  <Card className="admin-page-header" variant="outlined">
    <Flex align="center" gap={16} wrap="wrap">
      <div className="admin-page-header-copy">
        <Typography.Text className="admin-page-header-category">{category}</Typography.Text>
        <Typography.Title level={2} className="admin-page-header-title">
          {title}
        </Typography.Title>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </div>
    </Flex>
  </Card>
);

export default AdminPageHeader;
