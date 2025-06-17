'use client';

import { Table, Badge, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { formatExamDate } from '@/lib/dateUtils';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function SeatingChart({ exam }: { exam: any }) {
  const pdfRef = useRef<HTMLDivElement>(null);

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
        // Try to get department from different possible locations
        const department = record.student?.department || 
                         (typeof record.metadata === 'string' 
                          ? JSON.parse(record.metadata)?.department 
                          : record.metadata?.department);
        
        return (
          <Badge 
            color={getDepartmentColor(department)}
            text={department || 'N/A'}
          />
        );
      },
      key: 'department'
    }
  ];

  const downloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${exam.course.code}_seating_chart.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-4" ref={pdfRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {exam.course.code} - {exam.course.name}
        </h2>
        <Button 
          icon={<DownloadOutlined />}
          onClick={downloadPDF}
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
  if (!dept) return 'gray';
  
  const deptUpper = dept.toUpperCase();
  const colors: Record<string, string> = {
    'COMPUTER SCIENCE': 'blue',
    'COMPUTER': 'blue',
    'CS': 'blue',
    'EE': 'green',
    'ELECTRICAL': 'green',
    'ELECTRICAL ENGINEERING': 'green',
    'ME': 'orange',
    'MECHANICAL': 'orange',
    'MECHANICAL ENGINEERING': 'orange',
    'CE': 'red',
    'CIVIL': 'red',
    'CIVIL ENGINEERING': 'red',
    'MT': 'purple',
    'MATHEMATICS': 'purple'
  };
  return colors[deptUpper] || 'gray';
}