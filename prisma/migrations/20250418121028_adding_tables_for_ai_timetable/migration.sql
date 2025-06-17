-- CreateTable
CREATE TABLE "SchedulingPreference" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT,
    "roomId" TEXT,
    "dayPreference" TEXT[],
    "timePreference" TEXT[],
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchedulingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchedulingConstraint" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rule" JSONB NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchedulingConstraint_pkey" PRIMARY KEY ("id")
);
