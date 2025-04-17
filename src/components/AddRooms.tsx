'use client';

import { useState } from 'react';
import { RoomType } from '@prisma/client';

export default function RoomForm() {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 30,
    type: 'LECTURE_HALL' as RoomType
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Room created successfully!');
        setFormData({ name: '', capacity: 30, type: 'LECTURE_HALL' });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Room Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Capacity</label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
          className="mt-1 block w-full rounded-md border p-2"
          required
          min="1"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Room Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value as RoomType})}
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="LECTURE_HALL">Lecture Hall</option>
          <option value="LAB">Lab</option>
          <option value="EXAM_HALL">Exam Hall</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-b from-[#579FE1] to-[#1B8BF0] text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isSubmitting ? 'Creating...' : 'Create Room'}
      </button>
    </form>
  );
}