import { MongoClient, Db } from "mongodb";

// Extend global namespace to store Mock Database and Mongo client promise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mockDatabase: any | undefined;
}

const uri = "mongodb+srv://ryezen:Hanzz7308@kasangkatan.2mud2w0.mongodb.net";
let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;
const isMockMode = !uri;

// Seed data for Mock Mode
const MOCK_DONATIONS_SEED = [
  {
    ref_no: "MOCK_QR11111",
    amount: 50000,
    customer_name: "Rian Pemuda Tersesat",
    message: "Keren bang bot discord-nya! Sangat membantu server saya 🙌",
    status: "success",
    type: "QRIS",
    issuer: "GOPAY",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    paidAt: new Date(Date.now() - 1000 * 60 * 29),
  },
  {
    ref_no: "MOCK_QR22222",
    amount: 15000,
    customer_name: "Siska Wibu Baik",
    message: "Semangat terus kembangin project open source-nya! Beli kopi dulu ☕",
    status: "success",
    type: "QRIS",
    issuer: "OVO",
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    paidAt: new Date(Date.now() - 1000 * 60 * 119),
  },
  {
    ref_no: "MOCK_QR33333",
    amount: 100000,
    customer_name: "Budi Santoso",
    message: "Donasi bulanan untuk tools website gratisnya. Sangat hemat waktu saya!",
    status: "success",
    type: "QRIS",
    issuer: "DANA",
    createdAt: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    paidAt: new Date(Date.now() - 1000 * 60 * 358),
  },
  {
    ref_no: "MOCK_QR44444",
    amount: 25000,
    customer_name: "Anonim",
    message: "Bot telegram tools-nya mantul bang! 🚀🚀",
    status: "success",
    type: "QRIS",
    issuer: "SHOPEEPAY",
    createdAt: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
    paidAt: new Date(Date.now() - 1000 * 60 * 718),
  }
];

if (isMockMode) {
  console.log("⚠️ MONGODB_URI is not set. Running in Mock Mode for database operations.");
  if (!global._mockDatabase) {
    global._mockDatabase = {
      donations: [...MOCK_DONATIONS_SEED],
      target: parseInt(process.env.NEXT_PUBLIC_DONATION_TARGET || "5000000", 10),
    };
  }
} else {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function getDatabase(): Promise<{ db: Db | null; isMock: boolean; mockDb?: any }> {
  if (isMockMode) {
    return {
      db: null,
      isMock: true,
      mockDb: global._mockDatabase,
    };
  }
  const con = await clientPromise;
  if (!con) throw new Error("Failed to connect to MongoDB client.");
  return {
    db: con.db("ryezenn_donation"),
    isMock: false,
  };
}
