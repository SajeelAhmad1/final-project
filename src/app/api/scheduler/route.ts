// app/api/scheduler/route.ts
import { NextResponse } from 'next/server';
import { AIScheduler } from '@/lib/services/aiScheduler';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { algorithm = 'genetic' } = body;
    
    const scheduler = new AIScheduler();
    const schedule = await scheduler.generateTimetable(algorithm);
    
    return NextResponse.json({ success: true, schedule });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const scheduler = new AIScheduler();
    const currentSchedule = await scheduler.getCurrentSchedule();
    
    return NextResponse.json(currentSchedule);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}