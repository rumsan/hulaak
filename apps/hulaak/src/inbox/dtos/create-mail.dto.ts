// model Email {
//   id        String       @id @default(cuid())
//   address   String
//   mailbox   String
//   domain    String?
//   mailCuid  String
//   from      String?
//   subject   String?
//   date      DateTime
//   read      Boolean   @default(false)
//   text      String?
//   html      String?

//   @@map("tbl_emails")
// }

import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateMailDto {
  @IsDate()
  date: Date;

  @IsString()
  @IsOptional()
  from: string;

  @IsString()
  to: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsString()
  @IsOptional()
  html: string;

  @IsString()
  raw: string;
}
