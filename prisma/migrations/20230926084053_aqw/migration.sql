/*
  Warnings:

  - Added the required column `parkingZoneId` to the `parkingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parkingHistory" ADD COLUMN     "parkingZoneId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "parkingHistory" ADD CONSTRAINT "parkingHistory_parkingZoneId_fkey" FOREIGN KEY ("parkingZoneId") REFERENCES "parkingZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
