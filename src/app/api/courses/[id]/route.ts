import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get email credentials from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// Helper function to send email
async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Course Management System" <${EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

// Helper function to create notification
async function createNotification(userId: string, title: string, message: string) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message
    }
  });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id } = params;

    // Get the current course with faculty information
    const currentCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        faculty: {
          include: {
            user: true
          }
        }
      }
    });

    if (!currentCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id },
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
            user: true
          }
        }
      }
    });

    // Handle faculty assignment changes
    if (currentCourse.facultyId !== updatedCourse.facultyId) {
      // Notify previous faculty if they were removed
      if (currentCourse.facultyId && currentCourse.faculty) {
        try {
          const previousFaculty = currentCourse.faculty;
          const emailContent = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border-radius: 10px;">
              <div style="background: linear-gradient(to bottom, #579FE1, #2290F3); padding: 15px; border-radius: 10px;">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff;">Course Management System</h1>
              </div>
              <div style="margin-top: 20px; padding: 20px; background-color: #ffffff; border-radius: 10px; border: 2px solid #2290F3;">
                <h2 style="font-size: 20px; color: #2290F3; margin: 0;">Course Assignment Removed</h2>
                <p style="font-size: 16px; color: #555555; margin-top: 20px;">
                  Dear ${previousFaculty.firstName} ${previousFaculty.lastName},
                </p>
                <p style="font-size: 16px; color: #555555;">
                  You are no longer assigned to teach the following course:
                </p>
                <div style="margin: 10px 0; padding: 10px; border-radius: 5px; background-color: #f0f4f8; display: inline-block;">
                  <p style="font-size: 18px; font-weight: bold; color: #2290F3;">
                    ${updatedCourse.code} - ${updatedCourse.name}<br>
                    Department: ${updatedCourse.department}<br>
                    Credits: ${updatedCourse.credits}
                  </p>
                </div>
              </div>
              <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #2290F3;">
                <p style="font-size: 12px; color: #777777;">© ${new Date().getFullYear()} Course Management System. All rights reserved.</p>
              </div>
            </div>
          `;

          await sendEmail(
            previousFaculty.user.email,
            `Course Assignment Removed: ${updatedCourse.code}`,
            emailContent
          );

          await createNotification(
            previousFaculty.userId,
            `Course Assignment Removed: ${updatedCourse.code}`,
            `You are no longer teaching ${updatedCourse.name} (${updatedCourse.code})`
          );
        } catch (error) {
          console.error('Error notifying previous faculty:', error);
        }
      }

      // Notify new faculty if assigned
      if (updatedCourse.facultyId && updatedCourse.faculty) {
        try {
          const newFaculty = updatedCourse.faculty;
          const emailContent = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border-radius: 10px;">
              <div style="background: linear-gradient(to bottom, #579FE1, #2290F3); padding: 15px; border-radius: 10px;">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff;">Course Management System</h1>
              </div>
              <div style="margin-top: 20px; padding: 20px; background-color: #ffffff; border-radius: 10px; border: 2px solid #2290F3;">
                <h2 style="font-size: 20px; color: #2290F3; margin: 0;">New Course Assignment</h2>
                <p style="font-size: 16px; color: #555555; margin-top: 20px;">
                  Dear ${newFaculty.firstName} ${newFaculty.lastName},
                </p>
                <p style="font-size: 16px; color: #555555;">
                  You have been assigned to teach the following course:
                </p>
                <div style="margin: 10px 0; padding: 10px; border-radius: 5px; background-color: #f0f4f8; display: inline-block;">
                  <p style="font-size: 18px; font-weight: bold; color: #2290F3;">
                    ${updatedCourse.code} - ${updatedCourse.name}<br>
                    Department: ${updatedCourse.department}<br>
                    Credits: ${updatedCourse.credits}
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
          `;

          await sendEmail(
            newFaculty.user.email,
            `New Course Assignment: ${updatedCourse.code}`,
            emailContent
          );

          await createNotification(
            newFaculty.userId,
            `New Course Assignment: ${updatedCourse.code}`,
            `You have been assigned to teach ${updatedCourse.name} (${updatedCourse.code})`
          );
        } catch (error) {
          console.error('Error notifying new faculty:', error);
        }
      }
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Get the course with faculty information before deleting
    const courseToDelete = await prisma.course.findUnique({
      where: { id },
      include: {
        faculty: {
          include: {
            user: true
          }
        }
      }
    });

    if (!courseToDelete) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete the course
    await prisma.course.delete({
      where: { id }
    });

    // Notify faculty if the course was assigned to someone
    if (courseToDelete.facultyId && courseToDelete.faculty) {
      try {
        const faculty = courseToDelete.faculty;
        const emailContent = `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border-radius: 10px;">
            <div style="background: linear-gradient(to bottom, #579FE1, #2290F3); padding: 15px; border-radius: 10px;">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff;">Course Management System</h1>
            </div>
            <div style="margin-top: 20px; padding: 20px; background-color: #ffffff; border-radius: 10px; border: 2px solid #2290F3;">
              <h2 style="font-size: 20px; color: #2290F3; margin: 0;">Course Deleted</h2>
              <p style="font-size: 16px; color: #555555; margin-top: 20px;">
                Dear ${faculty.firstName} ${faculty.lastName},
              </p>
              <p style="font-size: 16px; color: #555555;">
                The following course you were teaching has been deleted:
              </p>
              <div style="margin: 10px 0; padding: 10px; border-radius: 5px; background-color: #f0f4f8; display: inline-block;">
                <p style="font-size: 18px; font-weight: bold; color: #2290F3;">
                  ${courseToDelete.code} - ${courseToDelete.name}<br>
                  Department: ${courseToDelete.department}<br>
                  Credits: ${courseToDelete.credits}
                </p>
              </div>
            </div>
            <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #2290F3;">
              <p style="font-size: 12px; color: #777777;">© ${new Date().getFullYear()} Course Management System. All rights reserved.</p>
            </div>
          </div>
        `;

        await sendEmail(
          faculty.user.email,
          `Course Deleted: ${courseToDelete.code}`,
          emailContent
        );

        await createNotification(
          faculty.userId,
          `Course Deleted: ${courseToDelete.code}`,
          `The course ${courseToDelete.name} (${courseToDelete.code}) has been deleted`
        );
      } catch (error) {
        console.error('Error notifying faculty about course deletion:', error);
      }
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}