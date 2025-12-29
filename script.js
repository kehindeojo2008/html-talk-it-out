
   const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "OPENROUTER_API_KEY"


const createChatLi = (message, className) => {
    // Create a <li> element and add the classes
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    
    // Set the inner HTML. 
    // We use the 'message' variable passed into the function, not hardcoded text.
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    
    return chatLi; // This returns the element so we can append it
}

const generateResponse = (incomingChat) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChat.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages:[{role:"user", content: userMessage}]
        })
    }
    fetch(API_URL,requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent =
    data.choices?.[0]?.message?.content || "No response received.";

    }).catch((error) =>{
        messageElement.textContent ="Oops! Something went wrong. Please try again."; 
    })
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // 1. Add User Message to the UI
    const outgoingChat = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChat);
    
    // 2. Clear input and scroll to bottom
    chatInput.value = "";
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // 3. Simulate Gemini Response after a short delay
    setTimeout(() => {
    const incomingChat = createChatLi("I'm processing your request...", "incoming");
    chatbox.appendChild(incomingChat);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    generateResponse(incomingChat); 
}, 600);

}

sendChatBtn.addEventListener("click", handleChat);

// Optional: Allow sending with the "Enter" key
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});
