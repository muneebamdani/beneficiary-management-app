const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/saylani-welfare"

export const dbConfig = {
  uri: MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
}
