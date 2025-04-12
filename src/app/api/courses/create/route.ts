import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get email credentials from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.code || !body.name || !body.department || !body.credits) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the course
    const newCourse = await prisma.course.create({
      data: {
        code: body.code,
        name: body.name,
        department: body.department,
        credits: body.credits,
        facultyId: body.facultyId || null
      },
      include: {
        faculty: {
          include: {
            user: true // Include the associated user to get the email
          }
        }
      }
    });

    // If course is assigned to a faculty, send them an email
    if (body.facultyId && newCourse.faculty) {
      try {
        const faculty = newCourse.faculty;
        const facultyEmail = faculty.user.email;
        
        // Create transporter using app password authentication
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_APP_PASSWORD
          }
        });
        
        await transporter.sendMail({
          from: `"Course Management System" <${EMAIL_USER}>`,
          to: facultyEmail,
          subject: `New Course Assignment: ${newCourse.code} - ${newCourse.name}`,
          html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border-radius: 10px;">
              <div style="background: linear-gradient(to bottom, #579FE1, #2290F3); padding: 15px; border-radius: 10px;">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff;">Course Management System</h1>
              </div>
              <div style="margin-top: 20px; padding: 20px; background-color: #ffffff; border-radius: 10px; border: 2px solid #2290F3;">
                <h2 style="font-size: 20px; color: #2290F3; margin: 0;">New Course Assignment</h2>
                <p style="font-size: 16px; color: #555555; margin-top: 20px;">
                  Dear ${faculty.firstName} ${faculty.lastName},
                </p>
                <p style="font-size: 16px; color: #555555;">
                  You have been assigned to teach the following course:
                </p>
                <div style="margin: 10px 0; padding: 10px; border-radius: 5px; background-color: #f0f4f8; display: inline-block;">
                  <p style="font-size: 18px; font-weight: bold; color: #2290F3;">
                    ${newCourse.code} - ${newCourse.name}<br>
                    Department: ${newCourse.department}<br>
                    Credits: ${newCourse.credits}
                  </p>
                </div>
                <p style="font-size: 16px; color: #555555; margin-top: 20px;">
                  Please log in to the system to view more details.
                </p>
              </div>
              <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #2290F3;">
                <p style="font-size: 12px; color: #777777;">© ${new Date().getFullYear()} Course Management System. All rights reserved.</p>
              </div>
            </div>
          `,
        });

        // Also create a notification in the database
        await prisma.notification.create({
          data: {
            userId: faculty.userId,
            title: `New Course Assignment: ${newCourse.code}`,
            message: `You have been assigned to teach ${newCourse.name} (${newCourse.code})`,
          }
        });

      } catch (emailError) {
        console.error('Error sending assignment email:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}