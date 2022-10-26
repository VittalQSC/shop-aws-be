const csv = require("csv-parser");
const fs = require("fs");
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-1" });

const DynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

(async function main() {
  const [products, stocks] = await Promise.all([
    getCsvData("scripts/import/productsTable.csv"),
    getCsvData("scripts/import/stocksTable.csv"),
  ]);

  const batchProducts = products.map(p => toDBBatchProduct(p));
  const batchStocks = stocks.map(s => toDBBatchStock(s));

  DynamoDB.batchWriteItem({
    RequestItems: {
      productsTable: batchProducts,
      stocksTable: batchStocks,
    },
  }, (err, data) => {
    if (err) {
      console.log("Import with ERROR", err);
      return;
    }

    console.log("Import with success! ", data);
  });
})();


// UTILS
function toDBBatchProduct(product) {
  return {
    PutRequest: {
      Item: {
        id: { S: product.id },
        title: { S: product.title },
        description: { S: product.description },
        price: { N: product.price },
      },
    },
  };
}

function toDBBatchStock(stock) {
  return {
    PutRequest: {
      Item: {
        product_id: { S: stock.product_id },
        count: { N: stock.count },
      },
    },
  };
}

function getCsvData(path) {
  return new Promise((resolve, reject) => {
    const result = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => result.push(data))
      .on("end", () => {
        resolve(result);
      });
  });
}
