const fs = require("fs");
const https = require("https");

exports.isImage = async function (attachment) {
  const type = attachment.contentType;
  return (type === "image/png" || type === "image/jpeg" || type === "image/jpg");
};

exports.download = async function (url, path) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(path))
          .on("error", reject)
          .once("close", () => resolve(path));
      } else {
        // Consume response data to free up memory
        response.resume();
        reject(new Error(`Request Failed. Status Code: ${response.statusCode}`));
      }
    });
  });
};