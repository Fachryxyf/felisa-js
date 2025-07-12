/*
  Warnings:

  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - Added the required column `ratingBahan` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingDesain` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingHarga` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingPackaging` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingWaktu` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "rating",
ADD COLUMN     "ratingBahan" INTEGER NOT NULL,
ADD COLUMN     "ratingDesain" INTEGER NOT NULL,
ADD COLUMN     "ratingHarga" INTEGER NOT NULL,
ADD COLUMN     "ratingPackaging" INTEGER NOT NULL,
ADD COLUMN     "ratingWaktu" INTEGER NOT NULL;
