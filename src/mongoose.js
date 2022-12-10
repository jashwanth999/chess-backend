import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost:27017/chess", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err.message);
  });
