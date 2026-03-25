-- Create attendee registrations table
CREATE TABLE `AttendeeRegistration` (
  `id` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `organization` VARCHAR(191) NULL,
  `county` VARCHAR(191) NULL,
  `attendeeType` VARCHAR(191) NOT NULL,
  `interests` TEXT NULL,
  `notes` TEXT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'REGISTERED',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create feedback submissions table
CREATE TABLE `FeedbackSubmission` (
  `id` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `category` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'NEW',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Indexes
CREATE INDEX `AttendeeRegistration_email_idx` ON `AttendeeRegistration`(`email`);
CREATE INDEX `AttendeeRegistration_status_idx` ON `AttendeeRegistration`(`status`);
CREATE INDEX `AttendeeRegistration_createdAt_idx` ON `AttendeeRegistration`(`createdAt`);

CREATE INDEX `FeedbackSubmission_status_idx` ON `FeedbackSubmission`(`status`);
CREATE INDEX `FeedbackSubmission_createdAt_idx` ON `FeedbackSubmission`(`createdAt`);
