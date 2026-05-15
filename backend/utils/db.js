import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const conectDB = async () => {
  try {
    if (cached.conn) {
      console.log("Already Connected");
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(process.env.MONGOURL_URL)
        .then((mongoose) => {
          console.log("MongoDB Connected");
          return mongoose;
        });
    }

    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
};

export default conectDB;