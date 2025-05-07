import { Badge, ConfigProvider, Menu } from "antd"
import { FaCirclePlus, FaCoins, FaHouseUser } from "react-icons/fa6"
import ProfileScreen from "../screens/profile/view/ProfileScreen"
import { useAuth } from "@/context/auth/useAuth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosChatboxes, IoMdNotifications } from "react-icons/io"
import { TbNorthStar } from "react-icons/tb"
import { FaHistory } from "react-icons/fa"
import { useMessage } from "@/context/socket/useMessage"

const TabBar = () => {
  const { localStrings, user } = useAuth();
  const { unreadNotification } = useMessage();
  const router = useRouter();
  const pathname = usePathname();
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            iconSize: 24,
            fontSize: 24,
            itemHeight: 60,
            itemMarginBlock: 20
          }
        }
      }}
    >
      <ProfileScreen />
      <Menu
        mode="inline"
        items={[
          {
            key: '/package',
            label: <div className="ml-4 flex justify-between items-center">
              <span>{user?.point}</span>
              <FaCirclePlus />
            </div>,
            icon: <FaCoins color="yellow"/>
          },
          { key: '/home', label: <span className="ml-4">{localStrings.Tabbar.Home}</span>, icon: <FaHouseUser /> },
          { key: '/chat', label: <span className="ml-4">{localStrings.Tabbar.History}</span>, icon: <IoIosChatboxes /> },
          { key: '/horoscope', label: <span className="ml-4">{localStrings.Tabbar.Horoscope}</span>, icon: <TbNorthStar /> },
          { key: '/notification', label: <span className="ml-4">{localStrings.Tabbar.Notification}</span>, icon: <Badge size="small" count={unreadNotification} overflowCount={10}><IoMdNotifications /></Badge> },
          { key: '/transaction-history', label: <span className="ml-4">{localStrings.Tabbar.TransactionHistory}</span>, icon: <FaHistory /> },
        ]}
        theme='dark'
        selectedKeys={[current]}
        onClick={(e) => router.push(e.key)}

      />
    </ConfigProvider>
  )
}

export default TabBar