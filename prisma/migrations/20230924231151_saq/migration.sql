/*
  Warnings:

  - You are about to drop the column `amountDue` on the `parkingHistory` table. All the data in the column will be lost.
  - You are about to alter the column `hourlyCost` on the `parkingZone` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
  - Added the required column `amountPaid` to the `parkingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parkingHistory" DROP COLUMN "amountDue",
ADD COLUMN     "amountPaid" DECIMAL(65,2) NOT NULL;

-- AlterTable
ALTER TABLE "parkingZone" ALTER COLUMN "hourlyCost" SET DATA TYPE DECIMAL(65,2);
