'use client';

import { Table, Badge, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { formatExamDate } from '@/lib/dateUtils';

export function SeatingChart({ exam }: { exam: any }) {
  const columns = [
    {
      title: 'Seat',
      dataIndex: 'seatNumber',
      key: 'seat',
      width: 80
    },
    {
      title: 'Roll Number',
      dataIndex: ['student', 'rollNumber'],
      key: 'rollNumber'
    },
    {
      title: 'Name',
      render: (_: any, record: any) => (
        `${record.student.firstName} ${record.student.lastName}`
      ),
      key: 'name'
    },
    {
      title: 'Department',
      render: (_: any, record: any) => {
        // Parse metadata if stored as JSON string
        const metadata = typeof record.metadata === 'string' 
          ? JSON.parse(record.metadata)
          : record.metadata;
        
        return (
          <Badge 
            color={getDepartmentColor(metadata?.department)}
            text={metadata?.department}
          />
        );
      },
      key: 'department'
    }
  ];

  const handleDownload = () => {
    // Implement PDF generation
    console.log('Download seating plan');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {exam.course.code} - {exam.course.name}
        </h2>
        <Button 
          icon={<DownloadOutlined />}
          onClick={handleDownload}
        >
          Download Seating Plan
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <span className="font-medium">Date:</span> {formatExamDate(exam.date)}
          <span className="ml-4 font-medium">Room:</span> {exam.room.name}
          <span className="ml-4 font-medium">Invigilator:</span> {exam.invigilator?.firstName || 'Not assigned'}
        </div>
        
        <Table
          columns={columns}
          dataSource={exam.seating}
          rowKey="id"
          pagination={{ pageSize: 50 }}
        />
      </div>
    </div>
  );
}

function getDepartmentColor(dept?: string) {
  const colors: Record<string, string> = {
    'COMPUTER SCIENCE': 'blue',
    'EE': 'green',
    'ME': 'orange',
    'CE': 'red',
    'MT': 'purple'
  };
  return dept ? colors[dept] || 'gray' : 'gray';
}