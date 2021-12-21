const fs = require("fs");
const { Banners } = require("../../models/");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.getAllBanners = catchAsync(async (req, res, next) => {
  const banners = await Banners.findAll({});

  return res.status(200).send(banners);
});

exports.addBanner = catchAsync(async (req, res, next) => {
  const newBanner = await Banners.create();

  return res.status(201).send(newBanner);
});

exports.deleteBanner = catchAsync(async (req, res, next) => {
  const banner = await Banners.findOne({ where: { uuid: req.params.id } });

  if (!banner)
    return next(new AppError("Banner did not found with that ID", 404));

  if (banner.image) {
    fs.unlink(`public/banner/${banner.uuid}_banner.webp`, function (err) {
      if (err) throw err;
    });
  }
  await banner.destroy();

  return res.status(200).send("Successfully Deleted");
});

// Multer Properties
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.single("photo");

exports.uploadBannerImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("Please provide banner Image", 404));

  const uuid = req.params.id;
  const banner = await Banners.findOne({ where: { uuid } });

  if (!banner)
    return next(new AppError("Banner did not found with that ID", 404));

  const image = `${uuid}_banner.webp`;

  await sharp(req.file.buffer)
    .toFormat("webp")
    .toFile(`public/banner/${image}`);

  const updatedBanner = await banner.update({
    image,
  });

  return res.status(201).send(updatedBanner);
});
