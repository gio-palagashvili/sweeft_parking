/*
  Warnings:

  - You are about to drop the column `parkingZoneId` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_parkingZoneId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "parkingZoneId";
