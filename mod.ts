import { serve } from "https://deno.land/std/http/server.ts";
import { readFile } from "https://deno.land/std/fs/mod.ts";

const server = serve({ port: 8000 });
console.log("HTTP server running on http://localhost:8000/");

for await (const request of server) {
  let path = request.url === "/" ? "/index.html" : decodeURIComponent(request.url);
  const filePath = `.${path}`;

  try {
    // 尝试读取文件，适用于任何静态文件
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
  } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
    return "image/jpeg";
  } else if (path.endsWith(".png")) {
    return "image/png";
  } else if (path.endsWith(".mp3")) {
    return "audio/mpeg";
  } else if (path.endsWith(".css")) {
    return "text/css";
  } else if (path.endsWith(".js")) {
    return "application/javascript";
  }
  return "application/octet-stream"; // 默认为二进制流，适用于未指定的文件类型
}
