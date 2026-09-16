import express from "express";
import path from "path";
import serverApp from "./serverApp";

const app = express();

// Mount all API routes from serverApp first
app.use(serverApp);

// Determine port: strictly 3000 in AI Studio / dev, Render PORT in Render cloud environment
const isRender = Boolean(process.env.RENDER);
const PORT = isRender && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Vite middleware for development or static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Plateforme Scolaire Madagascar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
