import mongoose from "mongoose";
mongoose
  .connect(
    "mongodb+srv://jashwanth:jashwanthbj9@chess.pww3bsh.mongodb.net/?retryWrites=true",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err.message);
  });

const connectDatabase = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    await mongoose.connect(
      "mongodb+srv://jashwanth:jashwanthbj9@chess.pww3bsh.mongodb.net/?retryWrites=true"
    );

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();
