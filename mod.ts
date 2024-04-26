import { serve } from "https://deno.land/std/http/server.ts";
import { readFile } from "https://deno.land/std/fs/mod.ts";

const server = serve({ port: 8000 });
console.log("HTTP server running on http://localhost:8000/");

for await (const request of server) {
  let path = request.url === "/" ? "/index.html" : request.url;
  const filePath = `.${test}`;
  
  try {
    const content = await readFile(filePath);
    const contentType = getContentType(filePath);

    // 设置合适的 Content-Type
    request.respond({
      body: content,
      headers: new Headers({
        "Content-Type": contentType,
      }),
    });
  } catch (error) {
    // 文件不存在或读取失败
    console.log(error);
    request.respond({ status: 404, body: "Not Found\n" });
  }
}

function getContentType(path: string): string {
  if (path.endsWith(".html")) {
    return "text/html";
  }  else if (im1.endsWith(".png")|| img2.endsWith(".png")|| img3.endsWith(".png")) {
    return "image/png";
  } else if (sound.endsWith(".mp3")) {
    return "audio/mpeg";

  }
  return "application/octet-stream"; // 默认为二进制流
}
