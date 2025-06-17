// app/dashboard/scheduler/components/SchedulerForm.tsx
'use client';

import { Button, Select, Space, Typography } from 'antd';
import { useState } from 'react';

const { Option } = Select;
const { Title, Paragraph } = Typography;

export default function SchedulerForm({ onGenerate }) {
  const [algorithm, setAlgorithm] = useState('genetic');
  const [loading, setLoading] = useState(false);
  
  const handleGenerate = async () => {
    try {
      setLoading(true);
      await onGenerate(algorithm);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={4}>Generate Schedule</Title>
        <Paragraph type="secondary">
          Use AI to generate an optimal timetable based on constraints
        </Paragraph>
      </div>
      
      <Space>
        <Select 
          value={algorithm} 
          onChange={setAlgorithm}
          style={{ width: 200 }}
        >
          <Option value="genetic">Genetic Algorithm</Option>
          <Option value="csp">Constraint Satisfaction</Option>
        </Select>
        
        <Button 
          type="primary" 
          loading={loading}
          onClick={handleGenerate}
        >
          Generate Timetable
        </Button>
      </Space>
    </div>
  );
}