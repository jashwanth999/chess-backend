import mongoose from "mongoose";
mongoose
  .connect("mongodb+srv://jashwanth:jashwanthbj9@chess.pww3bsh.mongodb.net/?retryWrites=true&w=majority/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err.message);
  });
