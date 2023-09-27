/*
  Warnings:

  - You are about to drop the column `isExpired` on the `parkingHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,vehicleId]` on the table `parkingHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "parkingHistory" DROP COLUMN "isExpired";

-- CreateIndex
CREATE UNIQUE INDEX "parkingHistory_userId_vehicleId_key" ON "parkingHistory"("userId", "vehicleId");
