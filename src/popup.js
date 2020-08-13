let textArea = document.getElementById("textarea");

textArea.oninput = () => {
    const content = textArea.value;
    console.log(content);
    chrome.runtime.sendMessage({ msg: "User Input", data: content });
};