import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketApi } from '../api/tickets'
import type { Ticket,TicketPriority, TicketStatus,TicketListParams } from '../types'
import { Button, Card, Col, Row, Space, Table, Tag, Typography, Select,message } from 'antd'
import { PlusOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

const statusColors: Record<TicketStatus, string> = {
  open: 'blue',
  in_progress: 'orange',
  resolved: 'green',
  closed: 'default'
}

const priorityColors: Record<TicketPriority, string> = {
  low:'default',
  medium:'blue',
  high:'orange',
  urgent:'red'
}



function TicketList() {
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>()
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | undefined>()



  const loadTickets = async () => {
    setLoading(true)

    try {
      const data = await ticketApi.list(
        {
          status: statusFilter,
          priority: priorityFilter
        }
      )
      setTickets(data)
    } catch (error) {
        console.error(error)
        setError('Failed to load tickets')
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [statusFilter, priorityFilter])

  if (loading) {
    return <p>Loading tickets...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const columns: ColumnsType<Ticket> = [
    {
      title:'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, ticket: Ticket) => (
        <Button
          type="link"
          onClick={() => navigate(`/tickets/${ticket.id}`)}
        >
          {title}
        </Button>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: TicketStatus | null) => {
        if (!status) {
          return <Tag>UNKNOW</Tag>
        }

        return(
          <Tag color={statusColors[status]}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        )
      }
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key:'priority',
      width: 110,
      render: (priority: TicketPriority | null) => {
        if (!priority) {
          return <Tag>UNKNOWN</Tag>
        }

        return (
          <Tag color={priorityColors[priority]}>
            {priority.toUpperCase()}
          </Tag>
        )
      }
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string | null) => {
        if (!tags) {
          return 'None'
        }

        return (
          <Tag key={tags}>
            {tags.trim()}
          </Tag>
        )
      }
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 190,
      render: (createdAt: string | null) => {
        if (!createdAt) {
          return 'Unknown'
        }

        return new Date(createdAt).toLocaleString()
      }
    },
    {
      title: 'Details',
      key: 'actions',
      width: 100,
      render: (_: any, record: Ticket) => (
        <Button
          type="link"
          onClick={() => navigate(`/tickets/${record.id}`)}
        >
          View
        </Button>
      )
    }
    
  ]

  return (
    <div>
      <Card         
        style={{
          marginBottom: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none'
        }}>

        <Row justify="space-between" align="middle" gutter={[16,16]}>
          <Col xs={24} md={14} lg={16} xl={18} xxl={20}>
            <Button
            type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              style={{
                color:'white',
                paddingLeft: 0,
                marginBottom: 8
              }}
            >
              Back to Dashboard
            </Button>
            <Title level={2} style={{color:'white', margin:0}}>
              Ticket Management
            </Title>

            <div 
              style={{
                color: 'white',
                marginTop: 4
              }}
            >
              Manage and track all customer support tickets
            </div>
          </Col>

          <Col xs={24} md={10} lg={8} xl={6} xxl={4}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadTickets}
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    borderRadius: 8
                  }}
                >
                  Refresh
                </Button>

                <Button
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/tickets/new')}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    borderRadius: 8
                  }}
                >
                  New Ticket
                </Button>
              </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={[16,16]}>
          <Col xs={24} sm={16} lg={12}>
            <Select
              placeholder="Filter by status"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              style={{width: '100%'}}
            >
              <Select.Option value="open">
                Open
              </Select.Option>

              <Select.Option Value="in_progress">
                In Progress
              </Select.Option>

              <Select.Option value="resolved">
                Resolved
              </Select.Option>

              <Select.Option value="closed">
                Closed
              </Select.Option>
            </Select>
          </Col>

          <Col
            xs={24} sm={16} lg={12}
          >
            <Select
              placeholder="Filter by priority"
              allowClear
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{width: '100%'}}
            >
              <Select.Option value="low">
                Low
              </Select.Option>

              <Select.Option Value="medium">
                Medium
              </Select.Option>

              <Select.Option value="high">
                High
              </Select.Option>

              <Select.Option value="urgent">
                Urgent
              </Select.Option>
            </Select>
          
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default TicketList