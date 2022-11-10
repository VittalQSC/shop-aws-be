import * as AWS from "aws-sdk";
import { S3Event } from "aws-lambda/trigger/s3";

import { UPLOADED_BUCKET } from "~/constants/buckets";
import { parseCsv } from "~/utils/parseCsv";

const s3 = new AWS.S3();

export async function handler(event: S3Event) {
  try {
    for (const record of event.Records) {
      const products = await parseCsv(
        UPLOADED_BUCKET,
        record.s3.object.key,
        s3
      );

      const sqs = new AWS.SQS();
      products.forEach(product => {
        sqs.sendMessage({
          QueueUrl: `${process.env.SQS_URL}`,
          MessageBody: JSON.stringify(product),
        }, (err, data) => {
          if (err) {
            console.log(`Send with ERROR: ${err}`);
          } else {
            console.log(`Send product: ${JSON.stringify(data)}`, ` QueueUrl: ${process.env.SQS_URL}`);
          }
        });
      });

      await s3
        .copyObject({
          Bucket: UPLOADED_BUCKET,
          CopySource: `${UPLOADED_BUCKET}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace("uploaded", "parsed"),
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: UPLOADED_BUCKET,
          Key: record.s3.object.key,
        })
        .promise();

      console.log(
        "importFileParser.handler",
        `${
          record.s3.object.key
        } object was moved to ${record.s3.object.key.replace(
          "uploaded",
          "parsed"
        )}`
      );
    }
  } catch (error) {
    console.log("importFileParser.handler", `something went wrong: ${error}`);
  }
}
