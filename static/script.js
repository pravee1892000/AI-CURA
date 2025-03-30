document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-btn');
    const userInputField = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Display a dynamic welcome message based on the time of day
    setTimeout(() => {
        const greeting = getGreeting();
        displayMessage(`👋 ${greeting}! I'm CURA, your Health Care assistant. How can I assist you today?`, 'bot-message');
    }, 500);

    sendButton.addEventListener('click', sendMessage);
    userInputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            sendMessage();
        }
    });

    function sendMessage() {
        const userInput = userInputField.value.trim();
        if (userInput === '') return;

        displayMessage(userInput, 'user-message');

        // Clear input field
        userInputField.value = '';

        // Display typing indicator with random speed
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing');
        typingIndicator.innerHTML = '<i>Typing...</i>';
        chatBox.appendChild(typingIndicator);
        scrollToBottom();

        const botResponse = getInteractiveResponse(userInput);
        
        if (botResponse) {
            const delay = getRandomTypingDelay(botResponse);  
            setTimeout(() => {
                chatBox.removeChild(typingIndicator);
                displayMessage(botResponse, 'bot-message');
            }, delay);
        } else {
            // Simulate backend interaction
            fetch('/get_response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_input: userInput }),
            })
            .then(response => response.json())
            .then(data => {
                chatBox.removeChild(typingIndicator);
                displayMessage(data.response, 'bot-message');
            })
            .catch(error => {
                console.error('Error:', error);
                chatBox.removeChild(typingIndicator);
                displayMessage('⚠️ Oops! Something went wrong. Please try again.', 'bot-message');
            });
        }
    }

    function displayMessage(text, className) {
        const message = document.createElement('div');
        message.classList.add('message', className);
        
        const withEmoji = addRandomEmoji(text, className);
        message.innerHTML = withEmoji;

        chatBox.appendChild(message);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    }

    function getGreeting() {
        const hours = new Date().getHours();
        if (hours < 12) return "Good morning 🌞";
        if (hours < 18) return "Good afternoon 🌤️";
        return "Good evening 🌙";
    }

    function getInteractiveResponse(input) {
        const text = input.toLowerCase();

        const responses = {
            'hello': ["Hey! 😊 What's up?", "Hello! 👋 How can I assist you?", "Hi there! 🌟"],
            'hi': ["Hi! 👋 How are you?", "Hello! 😊 What brings you here?", "Hey! 🌟 Need any help?"],
            'how are you': ["I'm feeling fantastic! 😎 How about you?", "I'm just a bot, but I'm doing great! 🤖", "Feeling energetic today! 🌟 You?"],
            'thank you': ["You're very welcome! 😊", "🙏 My pleasure!", "No problem at all! 🌟"],
            'thanks': ["Anytime! 😊", "You're welcome! 👍", "Happy to help! 🌟"],
            'bye': ["👋 Take care! Stay healthy!", "Bye! 😊 See you soon!", "Goodbye! 🌟 Wishing you a great day!"],
            'help': ["🤖 I'm here to assist you with health-related queries. Feel free to ask anything!", "Need help? 😊 Just ask!", "I'm ready to help! 🚀 Ask me anything!"],
            'feeling sad': ["I'm here for you! 💙 Do you want to talk about it?", "😔 Sending you a virtual hug! 🤗", "It's okay to feel down sometimes. Take a deep breath. 💕"],
            'feeling happy': ["That's awesome! 😊 Keep smiling! 🌟", "Yay! 🎉 Stay positive and spread the joy!", "Love to hear that! 😊 Keep it up! 💙"],
            'tell me a joke': [
                "Why don't skeletons fight each other? 🦴 Because they don't have the guts! 😂",
                "Why did the scarecrow win an award? 🎉 Because he was outstanding in his field! 😎",
                "I'm on a whiskey diet. 🥃 I've lost three days already! 🤣"
            ],
            'recommend exercise': [
                "🏃‍♂️ How about a 30-minute brisk walk today? It's great for your heart and mind! ❤️",
                "🧘‍♀️ Try some yoga stretches! It boosts flexibility and reduces stress. 🌿",
                "💪 Strength training twice a week can help build muscle and improve overall fitness! 🏋️‍♀️"
            ],
            'give me health tips': [
                "🥗 Eat a balanced diet rich in fruits, vegetables, and lean proteins.",
                "💧 Stay hydrated by drinking at least 8 glasses of water a day.",
                "🏃‍♂️ Exercise regularly for at least 30 minutes a day to stay fit and healthy!"
            ],
            'motivate me': [
                "🌟 Believe in yourself! You are capable of amazing things! 💙",
                "🔥 Keep pushing forward! You’ve got this! 💪",
                "✨ Stay strong, stay positive, and keep moving ahead! 🌿"
            ]
        };

        for (const key in responses) {
            if (text.includes(key)) {
                const randomIndex = Math.floor(Math.random() * responses[key].length);
                return responses[key][randomIndex];
            }
        }
        return null;
    }

    function getRandomTypingDelay(response) {
        const wordCount = response.split(' ').length;
        const baseTime = 300; // Base time for short responses
        const extraTime = wordCount * 100; // Add 100ms per word
        return baseTime + extraTime;
    }

    function addRandomEmoji(text, className) {
        if (className === 'bot-message') {
            const emojis = ['😊', '🤖', '✨', '👍', '😎', '🌟', '💙', '🔥', '💪', '🌿', '🎉'];
            if (Math.random() > 0.5) {  // 50% chance to add an emoji
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                return `${text} ${randomEmoji}`;
            }
        }
        return text;
    }
});
