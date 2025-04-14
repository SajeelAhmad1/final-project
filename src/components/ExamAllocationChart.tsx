'use client';

import { useMemo } from 'react';
import { Table, Badge } from 'antd';

export function RoomAllocationChart({ allocation }: { allocation: any[] }) {
  const columns = [
    {
      title: 'Room',
      dataIndex: ['room', 'name'],
      key: 'room'
    },
    {
      title: 'Capacity',
      dataIndex: ['room', 'capacity'],
      key: 'capacity'
    },
    {
      title: 'Students Assigned',
      dataIndex: 'students',
      render: (students: any[]) => students.length
    },
    {
      title: 'Department Distribution',
      render: (_: any, record: any) => (
        <div className="flex gap-1 flex-wrap">
          {Object.entries(
            record.students.reduce((acc: any, student: any) => {
              const key = `${student.department}-${student.batch}`;
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            }, {})
          ).map(([key, count]) => (
            <Badge key={key} count={count as number}>
              <span className="text-xs p-1 bg-gray-100 rounded">
                {key}
              </span>
            </Badge>
          ))}
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={allocation}
      rowKey={record => record.room.id}
      expandable={{
        expandedRowRender: (record) => (
          <StudentList students={record.students} />
        )
      }}
    />
  );
}

function StudentList({ students }: { students: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {students.map(student => (
        <div key={student.id} className="border p-2 rounded">
          <div className="font-medium">{student.rollNumber}</div>
          <div className="text-sm">
            {student.user.firstName} {student.user.lastName}
          </div>
          <div className="text-xs text-gray-500">
            Dept: {student.department}, Batch: {student.batch}
          </div>
        </div>
      ))}
    </div>
  );
}