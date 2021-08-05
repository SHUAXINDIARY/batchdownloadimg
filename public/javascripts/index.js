const Dom = {
    file: document.querySelector("#file"),
    dowBtn: document.querySelector("#dowBtn"),
};
Dom.file.addEventListener("onload", () => {
        console.log(oFREvent.target.result);
});
