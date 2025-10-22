import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";

const PresignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1)
});

@ApiTags("Uploads")
@ApiBearerAuth()
@Controller({ path: "uploads", version: "1" })
@UseGuards(RolesGuard)
export class UploadsController {
  @Post("presign")
  @Roles("owner", "admin", "member")
  async presign(@Body() body: unknown, @Req() req: any) {
    const { filename, contentType } = PresignSchema.parse(body);
    
    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.S3_ENDPOINT!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!
      }
    });

    const key = `${req.companyId}/${Date.now()}-${encodeURIComponent(filename)}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    return { url, key };
  }
}