"use client";
import React, { useEffect, useState } from 'react';
import useColor from '@/hooks/useColor';
import { Button, ConfigProvider, Drawer, Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { FaHouseUser, FaUserInjured } from 'react-icons/fa6';
import { Content, Header } from 'antd/es/layout/layout';
import { RiMenu2Line } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive'
import ProfileScreen from '../screens/profile/view/ProfileScreen';
import { useAuth } from '@/context/auth/useAuth';
import { useRouter } from 'next/navigation';
import TabBar from './TabBar';

const Screen = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const { localStrings } = useAuth();
  const { brandPrimaryDark, brandPrimaryTap, brandPrimary } = useColor();
  const [collapsed, setCollapsed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const isMobile = useMediaQuery({
    query: '(max-width: 991px)'
  })
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: brandPrimaryDark,
            siderBg: brandPrimary,
            triggerBg: brandPrimaryTap,
            colorText: 'white',
            headerBg: brandPrimaryDark,
            headerPadding: 0,
            headerHeight: isMobile ? 30 : 0
          },
          Menu: {
            darkItemBg: brandPrimary,
            darkItemHoverBg: brandPrimaryTap,
            darkItemSelectedBg: brandPrimaryDark
          },
        }
      }}
    >
      <Layout style={{ maxHeight: '100vh', scrollbarWidth: 'none' }} className='overflow-auto'>
        <Sider
          collapsible
          collapsed={collapsed}
          // onCollapse={(value) => setCollapsed(value)}
          breakpoint='lg'
          onBreakpoint={(value) => setCollapsed(value)}
          collapsedWidth={0}
          trigger={null}
          width={300}
          style={{ scrollbarWidth: 'none', height: '100vh', background: brandPrimary }}
        >
          <TabBar />
        </Sider>
        {isMobile && showDrawer && (
          <Drawer
            open={showDrawer}
            placement="left"
            onClose={() => setShowDrawer(false)}
            width={300}
            closeIcon={null}
            styles={{
              body: {
                background: brandPrimary,
                padding: 0,
                color: "white"
              }
            }}
          >
            <TabBar />
          </Drawer>
        )}
        <Layout className='max-h-screen overflow-auto' style={{ scrollbarWidth: 'none' }}>
          <Header className='flex items-center justify-between'>
            {isMobile && (
              <RiMenu2Line
                color='white'
                size={24}
                className='cursor-pointer ml-[-2px]'
                onClick={() => setShowDrawer(!showDrawer)}
              />
            )}
          </Header>
          <Content>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Screen;
