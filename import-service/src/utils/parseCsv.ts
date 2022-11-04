import * as AWS from "aws-sdk";
import csv from "csv-parser";

// TODO make return type generic or typed
export function parseCsv(
  bucket: string,
  path: string,
  s3?: AWS.S3 | undefined
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const s3Stream = (s3 ?? new AWS.S3())
      .getObject({
        Bucket: bucket,
        Key: path,
      })
      .createReadStream();
    const result: any[] = [];
    s3Stream
      .pipe(csv())
      .on("data", (data) => result.push(data))
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        resolve(result);
      });
  });
}
