-- AlterTable
ALTER TABLE `upload_location_t` ADD COLUMN `public` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pin` BOOLEAN NOT NULL DEFAULT true;
