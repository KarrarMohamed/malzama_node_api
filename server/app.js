const express = require("express");
const volleyball = require("volleyball");
const cors = require("cors");
const helmet = require("helmet");

const errorHandler = require("./middleware/errorHandler");

// const cron = require("node-cron");
// const formidableMiddleware = require("express-formidable");
require("dotenv").config();

const registrationRouter = require("./api_services/registration/registration_routes");
const commonMaterialsRouter = require("./api_services/materials/common/routes/common_routes");
const videoAndPdfRouter = require("./api_services/materials/pdf_and_videos/pdfs_and_videos_routes");
const quizRouter = require("./api_services/materials/quizes/quizes_routes");
const commentRouter = require("./api_services/comments/routes/comments_routes");
const testingRouter = require("./routes/testing");
const userRouter = require("./api_services/personal/routes");
const port = process.env.PORT || 3000;
// const host = '0.0.0.0'

// setup later
const app = express();
//app.use(formidableMiddleware());
app.use(volleyball);
app.use(
  cors()
  //    {origin: 'http://localhost:8080'}
);
app.use(helmet());
app.use(express.json());
//app.use("/files", express.static(__dirname + "/files"));

app.use("/api/v1/registration", registrationRouter);
app.use("/api/v1/materials/common", commonMaterialsRouter);
app.use("/api/v1/materials/videos-and-pdfs", videoAndPdfRouter);
app.use("/api/v1/materials/quizes", quizRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/users", userRouter);
app.use("/testing", testingRouter);

app.use(errorHandler);

app.listen(port, (res) => {
  console.log(`server is running ... \nlistening on ${port}`);
});
