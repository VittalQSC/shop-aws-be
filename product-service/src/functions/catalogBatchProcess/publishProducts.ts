import AWS from "aws-sdk";
import { IProduct } from "~/shared/types";

export default function publishProducts(
  products: IProduct[],
  Subject = "New Products created!"
): Promise<AWS.SNS.PublishResponse> {
  const sns = new AWS.SNS();
  return new Promise((resolve, reject) => {
    sns.publish(
      {
        Subject,
        Message: JSON.stringify(products),
        TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}
