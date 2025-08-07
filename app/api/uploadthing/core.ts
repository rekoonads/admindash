import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Upload error:", err.message);
    return { message: err.message };
  },
});

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
      minFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // Check if we have the required environment variables
      if (!process.env.UPLOADTHING_SECRET) {
        throw new Error(
          "UPLOADTHING_SECRET is not set in environment variables"
        );
      }

      console.log("Upload middleware triggered");
      console.log(
        "UploadThing Secret exists:",
        !!process.env.UPLOADTHING_SECRET
      );
      console.log(
        "UploadThing App ID exists:",
        !!process.env.UPLOADTHING_APP_ID
      );

      // Return metadata that will be available in onUploadComplete
      return {
        userId: "admin",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      console.log("File name:", file.name);
      console.log("File size:", file.size);

      // Return data that will be sent to the client
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
