// 1. تحديد العناصر الأساسية في الصفحة
const chatContainer = document.getElementById('chatbot-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

// تمت إزالة تعريف زر التبديل

// 2. وظيفة إنشاء رسالة جديدة وعرضها
function createMessageElement(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    
    // التعديل هنا: استبدال \n بـ <br> واستخدام innerHTML
    const formattedMessage = message.replace(/\n/g, '<br>');
    messageDiv.innerHTML = formattedMessage; // استخدم innerHTML لعرض الـ <br>
    
    chatMessages.appendChild(messageDiv);

    // التمرير التلقائي إلى أسفل نافذة الدردشة
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// 3. وظيفة إرسال رسالة المستخدم والتواصل مع الخادم
function sendMessage() {
    const message = userInput.value.trim();

    if (message !== '') {
        // عرض رسالة المستخدم
        createMessageElement(message, 'user');

        // مسح حقل الإدخال
        userInput.value = '';

        // استدعاء دالة التواصل مع الخادم
        getBotResponse(message);
    }
}

// 4. وظيفة إرسال طلب إلى الخادم الخلفي للحصول على رد AI
async function getBotResponse(userMessage) {
    // يمكنك إضافة رسالة 'البوت يكتب...' هنا قبل بدء Fetch

    try {
        // تأكد من أن هذا العنوان يتطابق مع عنوان الخادم الذي يعمل عليه server.js
        const backendURL = 'http://localhost:3000/api/chat'; 

        const response = await fetch(backendURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query: userMessage 
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // عرض رسالة الرد من الخادم الخلفي
        const botResponse = data.response || 'عذراً، حدث خطأ في الحصول على الرد.';
        createMessageElement(botResponse, 'bot');

    } catch (error) {
        console.error('Error fetching AI response:', error);
        createMessageElement('عذراً، تعذر الاتصال بخدمة الذكاء الاصطناعي (تأكد من تشغيل الخادم).', 'bot');
    }
}

// 5. ربط وظيفة الإرسال بضغط الزر وبزر Enter
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});