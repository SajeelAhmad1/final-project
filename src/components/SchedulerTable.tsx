// app/dashboard/scheduler/components/ScheduleTable.tsx
'use client';

import { Table, Tag, Space } from 'antd';

export default function ScheduleTable({ data, loading }) {
  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (record) => `${record.course?.code || 'N/A'} - ${record.course?.name || 'N/A'}`
    },
    {
      title: 'Faculty',
      key: 'faculty',
      render: (record) => record.course?.faculty?.firstName || 'Not assigned'
    },
    {
      title: 'Room',
      key: 'room',
      render: (record) => record.room?.name || 'Not assigned'
    },
    {
      title: 'Day',
      dataIndex: 'dayOfWeek',
      key: 'day'
    },
    {
      title: 'Time',
      key: 'time',
      render: (record) => {
        if (!record.startTime || !record.endTime) return 'Not scheduled';
        
        const start = new Date(record.startTime).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        });
        
        const end = new Date(record.endTime).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        });
        
        return `${start} - ${end}`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'SCHEDULED' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    }
  ];
  
  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="id" 
      loading={loading}
    />
  );
}