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
    // 发送文件
    sendFile(baseUrl) {
        return (baseUrl || this.baseUrl) + "/sendFile";
    }
    // 下载文件
    dowAll(baseUrl) {
        return (baseUrl || this.baseUrl) + "/dowAll";
    }
}
const { ref, onMounted, reactive } = Vue;
const app = {
    components: {},
    setup(props) {
        const upload = ref();
        console.log(upload);
        const state = reactive({
            file: null,
            data: [],
            loading: false,
        });
        const api = new Api();
        // 保存文件
        const saveFile = (e) => {
            const files = e.target.files;
            const types = ["application/vnd.ms-excel"];
            if (files.length === 0) {
                return;
            }
            if (!types.includes(files[0].type)) {
                alert("仅支持上传CSV文件");
                return;
            }
            state.file = e.target.files;
        };
        // 上传文件
        const send = async () => {
            if (!state.file || state.file.length === 0) {
                alert("请选择文件");
                return;
            }
            state.loading = true;
            let formData = new FormData();
            formData.append("file", state.file[0]);
            const result = await util.req(api.sendFile(), {
                method: "POST",
                body: formData,
            });
            state.loading = false;
            state.data = result.data;
        };
        // 下载文件
        const dow = (fileData) => {
            util.dolFile(fileData);
        };
        // 下载全部
        const dowAll = async () => {
            await util.req(api.dowAll(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: state.data }),
            });
        };
        const handleClear = () => {
            state.data = [];
            state.file = null;
            upload.value.value = "";
        };
        return {
            send,
            saveFile,
            dow,
            dowAll,
            handleClear,
            state,
            upload,
        };
    },
};
const vueApp = Vue.createApp(app);
vueApp.mount("#app");
