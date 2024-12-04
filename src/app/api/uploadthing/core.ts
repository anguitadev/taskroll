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
		.middleware(() => {
			return {
				maxFileCount: 1,
			};
		})
		.onUploadComplete(async ({ file }) => {
			return { fileKey: file.key };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
