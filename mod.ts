import { serve } from "https://deno.land/std/http/server.ts";

const server = serve({ port: 8000 });
console.log("HTTP server running on http://localhost:8000/");

// 定义安全的基目录，通常是你的静态文件目录
const baseDir = Deno.realPathSync(".");

for await (const request of server) {
  let path = request.url === "/" ? "/index.html" : decodeURIComponent(request.url);
  // 构造完整的文件路径
  const filePath = `${baseDir}${path}`;

  // 确保请求的文件路径是在预定目录内
  if (filePath.startsWith(baseDir) && Deno.statSync(filePath).isFile) {
    try {
      const content = await Deno.readFile(filePath);
      const contentType = getContentType(filePath);

      request.respond({
        body: new Uint8Array(content),
        headers: new Headers({
          "Content-Type": contentType,
        }),
      });
    } catch (error) {
      console.log(error);
      request.respond({ status: 404, body: "Not Found\n" });
    }
  } else {
    request.respond({ status: 403, body: "Forbidden\n" });
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
