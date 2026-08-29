import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Spin, Statistic, Typography} from 'antd'
import {
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons'

import { ticketApi } from "../api/tickets";

import { formToJSON } from "axios";
import { useEffect, useState } from "react";
import { TicketStatus } from "../types";

interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

const { Title, Paragraph } = Typography


function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [ stats, setStats ] = useState<TicketStats> ({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)

      try {
        const tickets = await ticketApi.list()

        const newStats: TicketStats = {
          total: tickets.length,

          open: tickets.filter(
            (ticket) => ticket.status === 'open'
          ).length,

          inProgress: tickets.filter(
            (ticket) => ticket.status === 'in_progress'
          ).length,

          resolved: tickets.filter(
            (ticket) => ticket.status === 'resolved'
          ).length
        }

        setStats(newStats)
      } catch (error) {
        console.error('Failed to load ticket statistics', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  
  return (
    <div>
      <Card style={{ marginBottom: 24}}>
        <Title level={2}>
          AstraTickets Dashboard
        </Title>

        <Paragraph>
          Manage customer support tickets and replies.
        </Paragraph>

        <Button           
          type="primary"
          icon={<FileTextOutlined />}
          onClick={() => navigate('/tickets')}
          style={{ marginRight: 12}}>
            View Tickets
        </Button>

        <Button 
          icon={<PlusOutlined />}
          onClick={() => navigate('/tickets/new')}
        >
          Create Ticket
        </Button>

      </Card>

       <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Tickets"
                value={stats.total}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Open Tickets"
                value={stats.open}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={stats.inProgress}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Resolved"
                value={stats.resolved}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  )
}

export default HomePage