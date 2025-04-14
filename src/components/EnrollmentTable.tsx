'use client';

import { Button, Table, Tag, Space, message } from 'antd';
import type { EnrollmentWithRelations } from '@/lib/types';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

type Props = {
  enrollments: EnrollmentWithRelations[];
};

export function EnrollmentTable({ enrollments }: Props) {
  const router = useRouter();

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/enrollments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error(await response.text());

      message.success(`Enrollment ${status.toLowerCase()}`);
      router.refresh();
    } catch (error) {
      message.error(error.message || 'Failed to update enrollment');
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: ['student', 'user', 'email'],
      key: 'student',
      render: (_: any, record: any) => (
        <span>
          {record.student.user.firstName} {record.student.user.lastName}
          <br />
          <small className="text-gray-500">{record.student.user.email}</small>
        </span>
      ),
    },
    {
      title: 'Course',
      dataIndex: ['course', 'code'],
      key: 'course',
      render: (_: any, record: any) => (
        <span>
          {record.course.code} - {record.course.name}
        </span>
      ),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      render: (semester: string) => (
        <Tag color="blue">
          {semester.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'APPROVED'
              ? 'green'
              : status === 'REJECTED'
              ? 'red'
              : 'orange'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<CheckOutlined />}
            onClick={() => handleStatusUpdate(record.id, 'APPROVED')}
            disabled={record.status !== 'PENDING'}
          />
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleStatusUpdate(record.id, 'REJECTED')}
            disabled={record.status !== 'PENDING'}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={enrollments}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
}