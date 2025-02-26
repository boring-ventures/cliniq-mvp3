/*
  Warnings:

  - You are about to drop the column `reorderLevel` on the `InventoryItem` table. All the data in the column will be lost.
  - Made the column `category` on table `InventoryItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "reorderLevel",
ADD COLUMN     "lastRestocked" TIMESTAMP(3),
ADD COLUMN     "minStock" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "supplier" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'pcs',
ALTER COLUMN "category" SET NOT NULL;
