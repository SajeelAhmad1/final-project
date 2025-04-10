"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredStudents(
  query: string = "",
  currentPage: number = 1,
  batch: string = "",
  department: string = ""
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const students = await prisma.student.findMany({
      where: {
        AND: [
          {
            OR: [
              { rollNumber: { contains: query, mode: "insensitive" } },
              { batch: { contains: query, mode: "insensitive" } },
              { department: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
              {
                user: {
                  email: { contains: query, mode: "insensitive" },
                },
              },
            ],
          },
          batch ? { batch: { equals: batch } } : {},
          department ? { department: { equals: department } } : {},
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            verified: true,
            isProfileComplete: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return students;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch students.");
  }
}

export async function fetchStudentsPages(
  query: string = "",
  batch: string = "",
  department: string = ""
) {
  try {
    const count = await prisma.student.count({
      where: {
        AND: [
          {
            OR: [
              { rollNumber: { contains: query, mode: "insensitive" } },
              { batch: { contains: query, mode: "insensitive" } },
              { department: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
              {
                user: {
                  email: { contains: query, mode: "insensitive" },
                },
              },
            ],
          },
          batch ? { batch: { equals: batch } } : {},
          department ? { department: { equals: department } } : {},
        ],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of students.");
  }
}

export async function getBatches() {
  try {
    const batches = await prisma.student.findMany({
      distinct: ["batch"],
      select: {
        batch: true,
      },
      orderBy: {
        batch: "asc",
      },
    });

    return batches.map((b) => b.batch);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch batches.");
  }
}

export async function getDepartments() {
  try {
    const departments = await prisma.student.findMany({
      distinct: ["department"],
      select: {
        department: true,
      },
      orderBy: {
        department: "asc",
      },
    });

    return departments.map((d) => d.department);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch departments.");
  }
}