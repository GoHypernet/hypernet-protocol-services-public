-- CreateTable
CREATE TABLE `identity_key_t` (
    `id` BINARY(16) NOT NULL,
    `identity_id` BINARY(16) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `encryption_key_e` VARCHAR(44) NOT NULL,
    `encryption_key_iv` VARCHAR(16) NOT NULL,
    `created_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_timestamp` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
