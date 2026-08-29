import type { PropsWithChildren } from "react";
import { Layout, Menu, Skeleton } from "antd";
import { HomeOutlined, FileTextOutlined } from "@ant-design/icons";
import { useLocation, useNavigate} from 'react-router-dom'

const { Header, Content, Footer } = Layout

function AppLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const location = useLocation()
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined/>,
      label: 'Dashboard'
    },

    {
      key: '/tickets',
      icon: <FileTextOutlined />,
      label: 'Tickets'
    }
  ]

  const selectedKey = location.pathname.startsWith('/tickets')
  ? '/tickets'
  : '/'

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 32
        }}>
          <div
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold'
            }}>
              AstraTickets
            </div>

            <Menu
              theme="dark"
              mode="horizontal"
              items={menuItems}
              selectedKeys={[selectedKey]}
              onClick={(event) => navigate(event.key)}
              style={{ 
                flex: 1, 
                background: 'transparent'
              }}
            />
        </Header>

        <Content
          style={{
            padding: 24,
            background: '#f5f5f5'
          }}>
            {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
           AstraTickets © {new Date().getFullYear()}
        </Footer>

    </Layout>
  )
}

export default AppLayout