-- CreateTable
CREATE TABLE "tbl_emails" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mailbox" TEXT NOT NULL,
    "domain" TEXT,
    "mailCuid" TEXT NOT NULL,
    "from" TEXT,
    "subject" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT,
    "html" TEXT,

    CONSTRAINT "tbl_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_logs" (
    "id" TEXT NOT NULL,
    "mailbox" TEXT NOT NULL,
    "domain" TEXT,
    "mailCuid" TEXT NOT NULL,
    "from" TEXT,
    "subject" TEXT,
    "text" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_settings" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_settings_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_settings_name_key" ON "tbl_settings"("name");
