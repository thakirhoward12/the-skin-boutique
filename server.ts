import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const __dirname = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to update products
  app.post("/api/update-products", (req, res) => {
    try {
      const newProducts = req.body;
      const productsFilePath = path.join(__dirname, "src", "data", "products.ts");
      
      let content = fs.readFileSync(productsFilePath, "utf-8");
      
      const arrayEndIndex = content.lastIndexOf("];");
      if (arrayEndIndex === -1) {
        return res.status(500).json({ error: "Could not find products array end" });
      }

      // Filter out the ping
      const realProducts = newProducts.filter((p: any) => p.brand !== "System");
      
      if (realProducts.length === 0) {
        return res.json({ status: "ok", message: "Ping received" });
      }

      const formattedProducts = realProducts.map((p: any) => {
        return `  {
    id: ${Math.floor(Math.random() * 1000000)},
    brand: ${JSON.stringify(p.brand)},
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    price: ${(p.price || 0).toFixed(2)},
    image: ${JSON.stringify("/images/" + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + ".jpg")},
    description: ${JSON.stringify(p.description)},
    ingredients: ${JSON.stringify(Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients || "")},
    reviews: []
  }`;
      }).join(",\n");

      let beforeEnd = content.slice(0, arrayEndIndex).trimEnd();
      if (beforeEnd.endsWith(',')) {
        beforeEnd = beforeEnd.slice(0, -1);
      }
      const newContent = beforeEnd + ",\n" + formattedProducts + "\n" + content.slice(arrayEndIndex);
      
      fs.writeFileSync(productsFilePath, newContent);
      res.json({ status: "ok", message: "Products updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update products" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
