import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AuthGuard } from "../../common/guards/auth.guard";

const PresignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1)
});

@Controller("uploads")
@UseGuards(AuthGuard)
export class UploadsController {
  @Post("presign")
  async presign(@Body() body: unknown, @Req() req: any) {
    const { filename, contentType } = PresignSchema.parse(body);
    const endpoint = process.env.S3_ENDPOINT!;
    const bucket = process.env.S3_BUCKET!;
    const region = "us-east-1"; // for minio-compatible, region is often ignored
    const s3 = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!
      }
    });

    const key = `${req.companyId}/${Date.now()}-${encodeURIComponent(filename)}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    return { url, key, bucket, contentType, expiresIn: 300 };
  }
}