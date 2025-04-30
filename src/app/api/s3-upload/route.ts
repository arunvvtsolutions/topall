import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
	}
});

async function uploadFileToS3(file:any, fileName:any, folderName:string) {
	const uniqueId = Date.now()
	const fileBuffer = file;
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: `${folderName.trim()}/${fileName.trim()}_${uniqueId}`,
		Body: fileBuffer,
		ContentType: "image/jpg"
	}
	const command = new PutObjectCommand(params);
	await s3Client.send(command);
	return `${process.env.AWS_S3_FILE_URL}/${folderName}/${fileName.trim()}_${uniqueId}`;
}

export const  POST = async (request:Request) => {
	try {
		const formData = await request.formData();
		const file:any = formData.get("file");
        const folderName:any = formData.get("folder")
		if(!file) {
			return NextResponse.json({ error: "File is required."}, { status: 400 });
		} 
		if(!file.type.includes('image')) return NextResponse.json({ error: "File should be image."}, { status: 400 });
		const buffer = Buffer.from(await file.arrayBuffer());
		const result = await uploadFileToS3(buffer, file.name, folderName);
		return NextResponse.json({ success: true, url: result, fileName: file.name});
	} catch (error) {
		return NextResponse.json({ error });
	}
}