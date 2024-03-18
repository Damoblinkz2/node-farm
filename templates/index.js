const http = require("http");
const url = require("url");
const fs = require("fs");

const overview = fs.readFileSync("overview.html", "utf-8");
const tempCard = fs.readFileSync("template-card.html", "utf-8");
const tempProduct = fs.readFileSync("template-product.html", "utf-8");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const data = fs.readFileSync("../dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    // replace the place holder with html
    const output = overview.replace("{%PRODUCT_CARDS%}", cardHtml);

    // return page
    res.end(output);

    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // 404
  } else {
    res.writeHead(404);
    res.end("page not found");
  }
});

server.listen(3000, "127.0.0.1", (err) => {
  if (err) return console.log("there is an error,try again");
  console.log("server is running on port 3000");
});
