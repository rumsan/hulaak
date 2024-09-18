-- CreateTable
CREATE TABLE "tbl_emails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "mailbox" TEXT NOT NULL,
    "domain" TEXT,
    "mailCuid" TEXT NOT NULL,
    "from" TEXT,
    "subject" TEXT,
    "date" DATETIME NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT
);

-- CreateTable
CREATE TABLE "tbl_settings" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_settings_name_key" ON "tbl_settings"("name");
