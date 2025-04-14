'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatePicker, TimePicker, InputNumber, Select, Button, message } from 'antd';

export function SchedulingForm({ courses, faculty }: { courses: any[], faculty: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [form, setForm] = useState({
    courseId: '',
    date: null,
    time: null,
    duration: 120,
    invigilatorId: ''
  });

  const handleSubmit = async () => {
    if (!form.courseId || !form.date || !form.time) {
      message.error('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Combine date and time
      const date = new Date(form.date);
      const [hours, minutes] = form.time.format('HH:mm').split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      
      const response = await fetch('/api/exams/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: form.courseId,
          date: date.toISOString(),
          duration: form.duration,
          invigilatorId: form.invigilatorId || undefined
        })
      });
      
      if (!response.ok) throw new Error(await response.text());
      
      const exam = await response.json();
      message.success('Exam scheduled successfully');
      router.push(`/admin/exams/${exam.id}/seating-plan`);
    } catch (error) {
      message.error(error.message || 'Failed to schedule exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <label className="block mb-1">Course</label>
        <Select
          className="w-full"
          options={courses.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
          value={form.courseId}
          onChange={(v) => setForm({ ...form, courseId: v })}
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1">Date</label>
          <DatePicker
            className="w-full"
            value={form.date}
            onChange={(d) => setForm({ ...form, date: d })}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Start Time</label>
          <TimePicker
            className="w-full"
            format="HH:mm"
            value={form.time}
            onChange={(t) => setForm({ ...form, time: t })}
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-1">Duration (minutes)</label>
        <InputNumber
          className="w-full"
          min={30}
          max={180}
          value={form.duration}
          onChange={(v) => setForm({ ...form, duration: v || 120 })}
        />
      </div>
      
      <div>
        <label className="block mb-1">Invigilator (optional)</label>
        <Select
          className="w-full"
          options={faculty.map(f => ({ 
            value: f.id, 
            label: `${f.designation} ${f.firstName} ${f.lastName} (${f.department})` 
          }))}
          value={form.invigilatorId}
          onChange={(v) => setForm({ ...form, invigilatorId: v })}
          allowClear
        />
      </div>
      
      <Button 
        type="primary" 
        onClick={handleSubmit}
        loading={loading}
      >
        Schedule Exam
      </Button>
    </div>
  );
}