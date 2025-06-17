// app/dashboard/scheduler/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, Card, notification } from 'antd';
import SchedulerForm from './components/SchedulerForm';
import ScheduleTable from './components/ScheduleTable';
import ConstraintManager from './components/ConstraintManager';
import ScheduleAnalytics from './components/ScheduleAnalytics';

const { TabPane } = Tabs;

export default function SchedulerPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCurrentSchedule();
  }, []);
  
  const fetchCurrentSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scheduler');
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load schedule: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateSchedule = async (algorithm) => {
    try {
      setLoading(true);
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      notification.success({
        message: 'Success',
        description: 'Schedule generated successfully!'
      });
      
      fetchCurrentSchedule();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to generate schedule: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Timetable Scheduler</h1>
      
      <Card className="mb-6">
        <SchedulerForm onGenerate={handleGenerateSchedule} />
      </Card>
      
      <Tabs defaultActiveKey="schedule">
        <TabPane tab="Schedule" key="schedule">
          <ScheduleTable data={schedule} loading={loading} />
        </TabPane>
        
        <TabPane tab="Constraints" key="constraints">
          <ConstraintManager onUpdate={fetchCurrentSchedule} />
        </TabPane>
        
        <TabPane tab="Analytics" key="analytics">
          <ScheduleAnalytics schedule={schedule} />
        </TabPane>
      </Tabs>
    </div>
  );
}