var express = require("express");
var router = express.Router();
const csvtojson = require("csvtojson");
const axios = require("axios");
const buffer = require("buffer").Buffer;
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
});
/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "Express",
    });
});

// csv->格式为json
const format = async (data) => {
    const ctj = csvtojson();
    let result = await ctj.fromFile(data);
    return result;
};

router.post("/sendFile", async (req, res, next) => {
    try {
        let data = await format(req.files[0].path);
        res.send({
            data,
            total: data.length,
        });
    } catch (error) {
        res.send({
            message: "错误",
        });
    }
});
// buffer下载单个文件
const saveByBuffer = async (url) => {
    let responese = await axios.get(url, {
        // 设置以buffer形式接收数据
        responseType: "arraybuffer",
    });
    // 转为buffer
    let resData = await buffer.from(responese.data);
    // 存储到本地
    await fs.promises.writeFile(
        `${path.join(__dirname, "../static")}${responese.request.path}`,
        resData
    );
};
// stream下载单个文件
const saveByStream = async (url) => {
    let responese = await axios.get(url, {
        responseType: "stream",
    });
    const ws = fs.createWriteStream(
        `${path.join(__dirname, "../static")}${responese.request.path}`
    );
    await responese.data.pipe(ws);
};

router.post("/dowAll", async (req, res, next) => {
    const { data } = req.body;
    // await saveByBuffer(data[0].url);
    // await saveByStream(data[0].url);
    const ws = fs.createWriteStream(
        path.join(__dirname, "../static") + "/allImg.zip"
    );
    archive.pipe(ws);
    for (let i = 0; i < data.length; i++) {
        let responese = await axios.get(data[i].url, {
            responseType: "stream",
        });
        await archive.append(responese.data, {
            name: responese.request.path.split("/")[1],
        });
    }
    archive.finalize();
    res.send({
        msg: "ok",
    });
});

module.exports = router;
