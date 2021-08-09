// 工具库
const util = {
    /**
     *
     * @param {string} api 接口
     * @param {Object} opt 请求配置
     * @returns {Promise}
     */
    req(api, opt) {
        return fetch(api, {
            ...opt,
        })
            .then((res) => {
                return res.json();
            })
            .catch((err) => {
                return err;
            });
    },
    async dolFile(item) {
        let data = await fetch(item.url).then((res) => {
            // 直接返回一个blob即可
            return res.blob();
        });
        var a = document.createElement("a");
        //文件的名称为时间戳加文件名后缀
        a.download = item.object;
        // 创建一个blob链接 理解成类似base64那样的
        a.href = URL.createObjectURL(data);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
};

// Api
class Api {
    constructor(baseUrl = "http://localhost:3000") {
        this.baseUrl = baseUrl;
    }
    sendFile(baseUrl) {
        return (baseUrl || this.baseUrl) + "/sendFile";
    }
    dowAll(baseUrl) {
        return (baseUrl || this.baseUrl) + "/dowAll";
    }
}

const app = {
    setup(props) {
        const state = Vue.reactive({
            file: null,
            data: [],
        });
        const api = new Api();
        // 保存文件
        const saveFile = (e) => {
            state.file = e.target.files;
        };
        // 上传文件
        const send = async () => {
            if (!state.file || state.file.length === 0) {
                alert("请选择文件");
                return;
            }
            let formData = new FormData();
            formData.append("file", state.file[0]);
            const result = await util.req(api.sendFile(), {
                method: "POST",
                body: formData,
            });
            state.data = result.data;
        };
        // 下载文件
        const dow = (item) => {
            util.dolFile(item);
        };
        // 下载全部
        const dowAll = async () => {
            console.log(state.data);
            await util.req(api.dowAll(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: state.data }),
            });
        };
        return {
            send,
            saveFile,
            dow,
            dowAll,
            state,
        };
    },
};
const vueApp = Vue.createApp(app);
vueApp.mount("#app");
