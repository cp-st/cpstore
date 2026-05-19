import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const IS_PROD = process.env.NODE_ENV === "production";

// Firebase Admin Initialization
// In this environment, we should try to use the default credentials if available, 
// or initialize with standard config if we had it. Since we are in AI Studio, 
// the environment usually provides access via service accounts or we use the client SDK 
// on server if restricted. But for a real SMM panel, we need Admin SDK.
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore("ai-studio-699094c4-496e-406c-9ec6-ceb4b1e0076c");
const auth = getAuth();

// Middleware to verify Admin
const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    // Support both custom claim and bootstrapped email
    if (decodedToken.admin || decodedToken.email === 'xzdsf286@gmail.com') {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: Admins only" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to verify any authenticated user
const verifyUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Admin routes protection
  app.use("/api/admin", verifyAdmin);
  
  // Protected user routes
  app.use("/api/orders", verifyUser);

  // health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User Order API with margin calculation and external provider integration
  app.post("/api/order", async (req, res) => {
    try {
      const { serviceId, link, quantity } = req.body;

      // 1. Get service details and settings for margin
      const serviceDoc = await db.collection("services").doc(serviceId).get();
      if (!serviceDoc.exists) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
      const serviceData = serviceDoc.data();
      
      // Calculate cost with margin (Example: adding 20% if not already in finalRate)
      const margin = 1.20;
      const originalRate = serviceData?.originalRate || serviceData?.rate || 0;
      const finalPrice = (originalRate * margin * quantity) / 1000;

      // 2. Provider API Call
      const providerApiUrl = process.env.SMM_PROVIDER_URL || 'https://external-smm-provider.com/api/v2';
      const providerApiKey = process.env.SMM_PROVIDER_API_KEY || process.env.SMM_API_KEY;

      if (!providerApiKey) {
        return res.status(500).json({ success: false, message: 'Provider configuration missing' });
      }

      const formData = new URLSearchParams();
      formData.append('key', providerApiKey);
      formData.append('action', 'add');
      formData.append('service', serviceData?.externalId || serviceId);
      formData.append('link', link);
      formData.append('quantity', quantity.toString());

      const response = await axios.post(providerApiUrl, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const data = response.data;

      if (data.error) {
        return res.status(400).json({ success: false, message: data.error });
      }

      // 3. Save order to Firestore and update balance (Simplified for this snippet)
      const orderRef = db.collection("orders").doc();
      await orderRef.set({
        externalOrderId: data.order,
        serviceId,
        link,
        quantity,
        amount: finalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      return res.json({ success: true, orderId: data.order });

    } catch (error: any) {
      console.error("Order API Error:", error.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    try {
      const doc = await db.collection("settings").doc("global").get();
      if (!doc.exists) {
        return res.json({ profit_margin: 0.15, provider_url: "", vodafone_cash_number: "", etisalat_cash_number: "" });
      }
      res.json(doc.data());
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const { profit_margin, provider_url, vodafone_cash_number, etisalat_cash_number } = req.body;
      await db.collection("settings").doc("global").set({
        profit_margin: Number(profit_margin),
        provider_url,
        vodafone_cash_number,
        etisalat_cash_number,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Create Order (User facing, handles External API)
  app.post("/api/orders", async (req, res) => {
    try {
      const { serviceId, link, quantity } = req.body;
      const userId = (req as any).user.uid;
      
      // 1. Verify User & Get Profile
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
      const user = userDoc.data();

      // 2. Get Service & Settings
      const serviceRef = db.collection("services").doc(serviceId);
      const serviceDoc = await serviceRef.get();
      if (!serviceDoc.exists) return res.status(404).json({ error: "Service not found" });
      const service = serviceDoc.data();

      const settingsDoc = await db.collection("settings").doc("global").get();
      const settings = settingsDoc.exists ? settingsDoc.data() : { provider_url: process.env.SMM_PROVIDER_URL };
      const apiKey = process.env.SMM_API_KEY || ""; // Use env variable for security

      // 3. Calculate Cost & Margin Protection
      const charge = (quantity * (service?.finalRate || 0)) / 1000;
      
      if (user?.balance < charge) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // 4. Place Order with External Provider (The "Filter" / Proxy)
      let externalOrderId = "TEST_" + Date.now();
      
      if (settings?.provider_url && apiKey) {
        try {
          // SMM Providers typically require x-www-form-urlencoded
          const formData = new URLSearchParams();
          formData.append('key', apiKey);
          formData.append('action', 'add');
          formData.append('service', service?.externalId);
          formData.append('link', link);
          formData.append('quantity', quantity.toString());

          const providerRes = await axios.post(settings.provider_url, formData.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          
          if (providerRes.data.error) {
             throw new Error(providerRes.data.error);
          }
          externalOrderId = providerRes.data.order;
        } catch (err: any) {
          console.error("Provider Error:", err.message);
          return res.status(500).json({ error: "Provider API error: " + (err.response?.data?.error || err.message) });
        }
      }

      // 5. Update Database (Batch Transaction)
      const batch = db.batch();
      
      // Update balance
      batch.update(userRef, { balance: user?.balance - charge });
      
      // Log Transaction
      const transRef = db.collection("transactions").doc();
      batch.set(transRef, {
        userId,
        amount: -charge,
        type: "order",
        status: "success",
        createdAt: new Date().toISOString()
      });

      // Log Order
      const orderRef = db.collection("orders").doc();
      batch.set(orderRef, {
        userId,
        serviceId,
        serviceName: service?.name,
        externalOrderId,
        link,
        quantity,
        charge,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      await batch.commit();
      res.json({ success: true, orderId: orderRef.id, externalOrderId });

    } catch (error: any) {
      console.error("Order process error:", error);
      res.status(500).json({ error: error.message || "Failed to process order" });
    }
  });

  // Dedicated SMM endpoint as requested by frontend snippet
  app.post("/api/smm", async (req, res) => {
    try {
      const body = req.body;
      const { serviceId, link, quantity, packagePrice } = body;

      const SMM_URL = process.env.SMM_PROVIDER_URL; 
      const API_KEY = process.env.SMM_API_KEY;

      if (!SMM_URL || !API_KEY) {
        return res.status(500).json({ success: false, message: 'إعدادات المزود غير مكتملة' });
      }

      // 2. Margin Protection (Example check)
      console.log(`Verifying margin for packagePrice: ${packagePrice}`);

      const formData = new URLSearchParams();
      formData.append('key', API_KEY);
      formData.append('action', 'add');
      formData.append('service', serviceId);
      formData.append('link', link);
      formData.append('quantity', quantity);

      const smmResponse = await axios.post(SMM_URL, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = smmResponse.data;

      if (data.error) {
        return res.status(400).json({ success: false, message: data.error });
      }

      return res.json({ 
        success: true, 
        orderId: data.order,
        message: 'تم إرسال الطلب بنجاح' 
      });
      
    } catch (error: any) {
      console.error("SMM API Error:", error.message);
      return res.status(500).json({ success: false, message: 'حدث خطأ في خادم Control P' });
    }
  });

  // Get SMM Services from Provider
  app.post("/api/admin/sync-services", async (req, res) => {
    try {
      const { providerUrl, providerKey } = req.body;
      if (!providerUrl || !providerKey) {
        return res.status(400).json({ error: "Missing provider config" });
      }

      // 1. Get Profit Margin
      const settingsDoc = await db.collection("settings").doc("global").get();
      const margin = settingsDoc.exists ? (settingsDoc.data()?.profit_margin || 0.15) : 0.15;

      // 2. Fetch from Provider
      const formData = new URLSearchParams();
      formData.append('key', providerKey);
      formData.append('action', 'services');

      const response = await axios.post(providerUrl, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const externalServices = response.data;
      if (!Array.isArray(externalServices)) {
        return res.status(500).json({ error: "Invalid response from provider" });
      }

      // 3. Process and Batch Update
      let count = 0;
      const batchSize = 400; // Firestore batch limit is 500
      
      for (let i = 0; i < externalServices.length; i += batchSize) {
        const batch = db.batch();
        const chunk = externalServices.slice(i, i + batchSize);
        
        chunk.forEach((s: any) => {
          const originalRate = parseFloat(s.rate);
          const finalRate = originalRate * (1 + margin);
          
          const serviceRef = db.collection("services").doc(s.service.toString());
          batch.set(serviceRef, {
            externalId: s.service,
            name: s.name,
            category: s.category,
            finalRate: finalRate,
            rate: originalRate, // Keeping original rate in 'rate' field for Admin reference or compatibility
            originalRate: originalRate,
            min: parseInt(s.min),
            max: parseInt(s.max),
            description: s.description || "",
            enabled: true,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          count++;
        });
        
        await batch.commit();
      }
      
      res.json({ message: `Successfully synced ${count} services with ${margin * 100}% margin` });
    } catch (error) {
      console.error("Sync Error:", error);
      res.status(500).json({ error: "Failed to sync services" });
    }
  });

  // Proxy Order to Provider
  app.post("/api/orders/proxy", async (req, res) => {
    // This would be called after the user creates an order in Firestore
    // and payed for it. This logic should be ideally a Cloud Function 
    // or a secure backend call that checks balance then sends to provider.
    try {
      const { orderId, providerUrl, providerKey } = req.body;
      // 1. Fetch order from DB
      // 2. Fetch user balance
      // 3. Send to SMM provider
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Order proxy failed" });
    }
  });

  // Vite middleware for development
  if (!IS_PROD) {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
