const socket = io();
const outputDiv = document.getElementById("output");
const input = document.getElementById("input");
input.focus();

socket.on("connect", () => console.log("connected"));
socket.on("output", (data) => addOutput(data, false));
socket.on("outputError", (data) => addOutput(data, true));
socket.on('disconnect', () => addOutput("Connection lost."));

function addOutput(output, error) {
    let p = document.createElement("p");
    p.setAttribute("id", "text");
    p.innerText = output;
    outputDiv.appendChild(p);
    input.focus();
    
    if(error) {
        p.classList.add("error");
    }

    p.scrollIntoView();
}

input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    if (input.value === "clear") {
        outputDiv.innerHTML = "";
        input.value = "";
    }

    socket.emit("input", input.value);
    input.value = "";
});
