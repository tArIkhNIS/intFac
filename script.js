const chatbox = document.getElementById("chatbox");
const input_btn = document.getElementById("input_btn");
const sendInputBtn = document.getElementById("sendInputBtn");
const randomTopicBtn = document.querySelector(".gptbtn:last-child");

const randomTopics = [
  "Қазақстан тарихы",
  "Ұлы Жібек жолы",
  "Қазақ хандығы",
  "Абылай хан",
  "Алаш Орда",
  "Түркі қағанаты",
];

function addMessage(message, isUser = false) {
  const messageElement = document.createElement("div");
  messageElement.className = isUser
    ? "user-message message"
    : "bot-message message";

  const avatar = document.createElement("img");
  avatar.className = isUser ? "user-logo" : "bot-logo";
  avatar.src = isUser ? "/userlogo.webp" : "/chatbotlogo.png";
  avatar.alt = isUser ? "User Avatar" : "Bot Avatar";
  avatar.width = "50";
  avatar.height = "50";

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";
  messageContent.textContent = message;

  messageElement.appendChild(avatar);
  messageElement.appendChild(messageContent);

  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function fetchAnswerFromAPI(question) {
  try {
    const apiUrl = `https://api.openai.com/v1/chat/completions`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer sk-vy4dBIkoV-iEVaE2MDrmIU-I2_npvVCSXxkxFMbhZCT3BlbkFJ-EQbz2U5MFPI4HHBS9qosfI4Ky2j-vIF8_pskryicA`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;
    addMessage(`tArIkh: ${answer}`);
  } catch (error) {
    addMessage("Ой! Жауапты алу кезінде қате туындады.");
  }
}

async function sendMessage(question) {
  const visibleQuestion = question;
  const hiddenQuestion = `${question}. Осы сөздерді қолданып тарих бойынша 5-10 қызықыты сөйлемді дайында`;
  addMessage(`You: ${visibleQuestion}`, true);
  await fetchAnswerFromAPI(hiddenQuestion);
}

function displayWelcomeMessage() {
  const welcomeMessage =
    "Сәлем! Мен tArIkh чат ботымын. Сен берген сөздерді қолданып сөйлем құрастырамын!";
  addMessage(welcomeMessage);
}

function handleUserInput() {
  const userInput = input_btn.value.trim();
  if (userInput) {
    sendMessage(userInput);
    input_btn.value = "";
  }
}

function getRandomTopic() {
  const randomIndex = Math.floor(Math.random() * randomTopics.length);
  return randomTopics[randomIndex];
}

function handleRandomTopic() {
  const randomTopic = getRandomTopic();
  sendMessage(randomTopic);
}

sendInputBtn.addEventListener("click", handleUserInput);
randomTopicBtn.addEventListener("click", handleRandomTopic);

input_btn.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleUserInput();
  }
});

window.onload = function () {
  displayWelcomeMessage();
};
