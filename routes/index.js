var express = require("express");
var router = express.Router();
const csvtojson = require("csvtojson");
const axios = require("axios");
const buffer = require("buffer").Buffer;
const fs = require("fs").promises;
const path = require("path");
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

router.post("/dowAll", async (req, res, next) => {
    console.log(fs);
    const { data } = req.body;
    let responese = await axios.get(data[0].url, {
        // 设置以buffer形式接收数据
        responseType: "arraybuffer",
    });
    // 转为buffer
    let resData = await buffer.from(responese.data);
    // 存储到本地
    await fs.writeFile(
        `${path.join(__dirname, "../static")}${responese.request.path}`,
        resData
    );
    res.send({
        msg: "ok",
    });
});

module.exports = router;
