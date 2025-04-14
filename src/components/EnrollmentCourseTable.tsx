'use client';
import { Table, Tag, Spin, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function EnrolledCoursesTable() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (status === 'loading') return; // Wait for session to load
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/enrollments?studentId=${session.user.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch enrollments: ${response.status}`);
        }
        
        const data = await response.json();
        setEnrollments(data);
      } catch (error: any) {
        console.error('Fetch enrollments error:', error);
        message.error(error.message || 'Failed to load enrollments');
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [session, status]); // Add status to dependencies

  const columns = [
    {
      title: 'Course Code',
      dataIndex: ['course', 'code'],
      key: 'code'
    },
    {
      title: 'Course Name',
      dataIndex: ['course', 'name'],
      key: 'name'
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      render: (semester: string) => (
        <Tag color="blue">
          {semester.replace('_', ' ')}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'APPROVED' ? 'green' :
          status === 'PENDING' ? 'orange' : 'red'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          danger
          disabled={record.status !== 'PENDING' || withdrawingId === record.id}
          loading={withdrawingId === record.id}
          onClick={() => handleWithdraw(record.id)}
        >
          Withdraw
        </Button>
      )
    }
  ];

  const handleWithdraw = async (enrollmentId: string) => {
    try {
      setWithdrawingId(enrollmentId);
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      message.success('Withdrawal successful');
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      message.error(error.message || 'Failed to withdraw');
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={enrollments}
      rowKey="id"
      loading={loading}
      pagination={false}
      locale={{ emptyText: 'No courses registered yet' }}
    />
  );
}