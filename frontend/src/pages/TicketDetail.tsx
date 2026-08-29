import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  message
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  SendOutlined
} from '@ant-design/icons'

import { ticketApi } from '../api/tickets'
import { userApi } from '../api/users'
import type {
  Reply,
  ReplyCreate,
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketUpdate,
  User
} from '../types'

const { Title, Paragraph } = Typography
const { TextArea } = Input

const statusColors: Record<TicketStatus, string> = {
  open: 'blue',
  in_progress: 'orange',
  resolved: 'green',
  closed: 'default'
}

const priorityColors: Record<TicketPriority, string> = {
  low: 'default',
  medium: 'blue',
  high: 'orange',
  urgent: 'red'
}

function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [replyForm] = Form.useForm<ReplyCreate>()
  const [editForm] = Form.useForm<TicketUpdate>()

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('Ticket ID is missing')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const [ticketData, replyData, userData] = await Promise.all([
          ticketApi.get(Number(id)),
          ticketApi.listReplies(Number(id)),
          userApi.list()
        ])

        setTicket(ticketData)
        setReplies(replyData)
        setUsers(userData)
      } catch (requestError) {
        console.error(requestError)
        setError('Failed to load ticket')
        message.error('Failed to load ticket')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const getUserName = (userId: number) => {
    const user = users.find((item) => item.id === userId)
    return user ? user.name || user.email : `User #${userId}`
  }

  const loadReplies = async () => {
    if (!id) return

    try {
      const data = await ticketApi.listReplies(Number(id))
      setReplies(data)
    } catch (requestError) {
      console.error(requestError)
      message.error('Failed to load replies')
    }
  }

  const handleAddReply = async (values: ReplyCreate) => {
    if (!id) return

    setReplySubmitting(true)

    try {
      await ticketApi.addReply(Number(id), values)
      message.success('Reply added successfully')
      replyForm.resetFields()
      await loadReplies()
    } catch (requestError: any) {
      console.error(requestError)
      message.error(
        requestError.response?.data?.detail || 'Failed to add reply'
      )
    } finally {
      setReplySubmitting(false)
    }
  }

  const openEditModal = () => {
    if (!ticket) return

    editForm.setFieldsValue({
      title: ticket.title,
      content: ticket.content,
      status: ticket.status,
      priority: ticket.priority,
      tags: ticket.tags
    })
    setEditVisible(true)
  }

  const handleUpdateTicket = async (values: TicketUpdate) => {
    if (!id) return

    setUpdating(true)

    try {
      await ticketApi.update(Number(id), values)
      const updatedTicket = await ticketApi.get(Number(id))
      setTicket(updatedTicket)
      setEditVisible(false)
      message.success('Ticket updated successfully')
    } catch (requestError: any) {
      console.error(requestError)
      message.error(
        requestError.response?.data?.detail || 'Failed to update ticket'
      )
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteTicket = () => {
    if (!id) return

    Modal.confirm({
      title: 'Delete Ticket',
      content:
        'Are you sure you want to delete this ticket? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await ticketApi.delete(Number(id))
          message.success('Ticket deleted successfully')
          navigate('/tickets')
        } catch (requestError: any) {
          console.error(requestError)
          message.error(
            requestError.response?.data?.detail || 'Failed to delete ticket'
          )
        }
      }
    })
  }

  if (loading) {
    return (
      <Card>
        <Spin />
        <span style={{ marginLeft: 12 }}>Loading ticket...</span>
      </Card>
    )
  }

  if (error || !ticket) {
    return (
      <Card>
        <Paragraph>{error || 'Ticket not found'}</Paragraph>
        <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
      </Card>
    )
  }

  return (
    <div>
      <Card
        style={{
          marginBottom: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none'
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tickets')}
          style={{ color: 'white', paddingLeft: 0, marginBottom: 8 }}
        >
          Back to Tickets
        </Button>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Ticket #{ticket.id}
            </Title>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                marginTop: 4
              }}
            >
              {ticket.title}
            </div>
          </div>

          <Space wrap>
            <Button
              icon={<EditOutlined />}
              onClick={openEditModal}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderColor: 'white'
              }}
            >
              Edit
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteTicket}
              style={{ background: '#ff4d4f', color: 'white' }}
            >
              Delete
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Title" span={2}>
            {ticket.title}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {ticket.status ? (
              <Tag color={statusColors[ticket.status]}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </Tag>
            ) : (
              'Unknown'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {ticket.priority ? (
              <Tag color={priorityColors[ticket.priority]}>
                {ticket.priority.toUpperCase()}
              </Tag>
            ) : (
              'Unknown'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Requester">
            {getUserName(ticket.requester_id)}
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {ticket.tags
              ? ticket.tags.split(',').map((tag) => (
                  <Tag key={tag}>{tag.trim()}</Tag>
                ))
              : 'None'}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {ticket.created_at
              ? new Date(ticket.created_at).toLocaleString()
              : 'Unknown'}
          </Descriptions.Item>
          <Descriptions.Item label="Updated">
            {ticket.updated_at
              ? new Date(ticket.updated_at).toLocaleString()
              : 'Unknown'}
          </Descriptions.Item>
          <Descriptions.Item label="Content" span={2}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {ticket.content}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Replies ({replies.length})</Title>
        <List
          dataSource={replies}
          locale={{ emptyText: 'No replies yet' }}
          renderItem={(reply) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <span style={{ fontWeight: 600 }}>
                      {getUserName(reply.author_id)}
                    </span>
                    <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                      {new Date(reply.updated_at).toLocaleString()}
                    </span>
                  </Space>
                }
                description={
                  <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                    {reply.content}
                  </Paragraph>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card
        style={{ marginTop: 16 }}
        title={
          <Space>
            <SendOutlined />
            <span>Add Reply</span>
          </Space>
        }
      >
        <Form<ReplyCreate>
          form={replyForm}
          layout="vertical"
          onFinish={handleAddReply}
        >
          <Form.Item
            label="Author"
            name="author_id"
            rules={[{ required: true, message: 'Please select an author' }]}
          >
            <Select
              placeholder="Select author"
              options={users.map((user) => ({
                value: user.id,
                label: user.name || user.email
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Reply Content"
            name="content"
            rules={[{ required: true, message: 'Please enter reply content' }]}
          >
            <TextArea rows={4} placeholder="Enter your reply..." />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={replySubmitting}
            >
              Send Reply
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="Edit Ticket"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form<TicketUpdate>
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateTicket}
        >
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Content" name="content">
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              options={[
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' }
              ]}
            />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
            <Select
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
            />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Input placeholder="login, auth, bug" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={updating}>
                Update
              </Button>
              <Button onClick={() => setEditVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TicketDetail
