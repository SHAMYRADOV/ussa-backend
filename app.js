const exp = require("constants");
const express = require("express");
const cors = require("cors");
const AppError = require("./utils/appError");

const app = express();

app.use(require("helmet")());
const limiter = require("express-rate-limit")({
  max: 1000,
  windowMs: 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(require("morgan")("dev"));
app.use(require("cookie-parser")());
app.use("/", limiter);
app.use(express.json({ limit: "50mb" }));
app.use(require("xss-clean")());

app.use("/users", require("./routes/users/usersRouter"));
app.use("/admin", require("./routes/admin/adminRouter"));
app.use("/public", require("./routes/public/publicRouter"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(require("./controllers/errorController"));

module.exports = app;
