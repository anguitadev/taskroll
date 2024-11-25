import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	documentUploader: f([
		"pdf",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	])
		// Set permissions and file types for this FileRoute
		// .middleware(async () => {
		// 	// This code runs on your server before upload
		// 	// If you throw, the user will not be able to upload
		// 	// if (!user) throw new UploadThingError("Unauthorized");

		// 	// Whatever is returned here is accessible in onUploadComplete as `metadata`
		// 	return { userId: user!.id };
		// })
		.onUploadComplete(async ({ file }) => {
			return { fileKey: file.key };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
