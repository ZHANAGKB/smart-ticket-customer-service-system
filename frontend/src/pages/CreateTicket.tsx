import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Space, Table, Tag, Typography, Input, Select, Divider, message, Form} from "antd";
import { PlusOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { TicketCreate, User, Ticket } from '../types'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from "react";
import { ticketApi } from "../api/tickets";
import { userApi } from "../api/users";

const { Title } = Typography
const { TextArea } = Input


function CreateTicket() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [userLoading, setUserLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [form] = Form.useForm()
    useEffect(() => {
        const loadUsers = async () => {
            setUserLoading(true)

            try {
                const data = await userApi.list()
                setUsers(data)
            } catch (error) {
                console.error(error)
                message.error('Failed to load users')
            } finally {
                setUserLoading(false)
            }
        }
        loadUsers()
    }, [])

    const handleSubmit = async (values: TicketCreate) => {
        setSubmitting(true)

        try {
        const ticket = await ticketApi.create(values)

        message.success('Ticket created successfully')

        navigate(`/tickets/${ticket.id}`)
        } catch (error: any) {
        console.error(error)

        const detail =
            error.response?.data?.detail ||
            'Failed to create ticket'

        message.error(detail)
        } finally {
        setSubmitting(false)
        }
    }
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
                            type='text'
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/tickets')}
                            style= {{
                                color: 'white',
                                padding: 0,
                                marginBottom: 8
                            }}
                        >
                            Back to Tickets
                        </Button>

                        <Title level={2} style={{color:'white', margin:0}}>
                            Create Ticket
                        </Title>  

                        <div 
                            style={{
                                color: 'white',
                                marginTop: 4
                            }}
                            >
                            Fill in the details to create a new support ticket
                        </div>  
                    </Col>
                </Row>
            </Card>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: 'open',
                        priority: 'medium'
                    }}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                             {
                                required: true,
                                message: 'Please enter ticket title'
                             }
                        ]}
                    >
                        <Input placeholder="Brief description of the issue"/ >
                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter ticket content'
                            }
                        ]}
                    >
                    <TextArea
                        rows={6}
                        placeholder="Detailed description of the issue"
                    />
                    </Form.Item>

                    <Form.Item
                        label="Requester"
                        name="requester_id"
                        rules={[
                            {
                                required: true,
                                message: 'please select a requester'
                            }
                        ]}
                    >
                        <Select
                            placeholder="Select requester"
                            loading={userLoading}
                        >
                            {users.map((user) => (
                                <Select.Option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name || user.email} ({user.email})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="Status"
                        name="status"
                    >
                        <Select>
                        <Select.Option value="open">
                            Open
                        </Select.Option>

                        <Select.Option value="in_progress">
                            In Progress
                        </Select.Option>

                        <Select.Option value="resolved">
                            Resolved
                        </Select.Option>

                        <Select.Option value="closed">
                            Closed
                        </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Priority"
                        name="priority"
                    >
                        <Select>
                        <Select.Option value="low">
                            Low
                        </Select.Option>

                        <Select.Option value="medium">
                            Medium
                        </Select.Option>

                        <Select.Option value="high">
                            High
                        </Select.Option>

                        <Select.Option value="urgent">
                            Urgent
                        </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Tags"
                        name="tags"
                        extra="Separate tags using commas"
                    >
                        <Input placeholder="login, auth, bug" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                            >
                                Create Ticket
                            </Button>

                            <Button
                                onClick={() => navigate('/tickets')}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

        </div>
    )
}

export default CreateTicket