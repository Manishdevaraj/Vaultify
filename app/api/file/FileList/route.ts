import r2 from '@/lib/CloudFlare/Config';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { bucketName, folderPrefix } = await req.json();

    if (!bucketName || !folderPrefix) {
      return NextResponse.json(
        { success: false, message: 'Bucket name and folder prefix are required.' },
        { status: 400 }
      );
    }

    // Fetch objects from the bucket
    const listObjectsCmd = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPrefix,
    });

    const res = await r2.send(listObjectsCmd);
    const files = res.Contents || [];

    const buildTree = (files: any[]) => {
      const tree: Record<string, any> = {};
      let totalSize = 0;

      files.forEach(({ Key, Size }) => {
        if (!Key || Size === undefined) return;

        totalSize += Size;

        const relativePath = Key.replace(folderPrefix, '');
        const parts = relativePath.split('/').filter(Boolean);

        let current = tree;

        parts.forEach((part, index) => {
          if (!current[part]) {
            current[part] =
              index === parts.length - 1
                ? { type: 'file', size: Size }
                : { type: 'folder', size: 0, children: {} };
          }

          if (index === parts.length - 1) {
            // If it's the file, add its size
            current[part].size = Size;
          } else {
            // If it's a folder, accumulate its size
            current[part].size += Size;
            current = current[part].children;
          }
        });
      });

      return { tree, totalSize };
    };

    const { tree, totalSize } = buildTree(files);

    return NextResponse.json({ success: true, tree, totalSize }, { status: 200 });
  } catch (error) {
    console.error('Error listing folder contents:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
