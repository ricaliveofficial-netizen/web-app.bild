const messagesContainer = document.getElementById('messages');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const languageSelect = document.getElementById('language');
const headerText = document.getElementById('header-text');
const aboutBtn = document.getElementById('about-btn');
const aboutModal = document.getElementById('about-modal');
const closeAbout = document.getElementById('close-about');
const aboutContent = document.getElementById('about-content');

let currentLanguage = 'bn';

// Load initial site data (Header + About)
async function loadSiteData() {
    const res = await fetch('/site-data');
    const data = await res.json();
    headerText.textContent = data.header;
    aboutContent.textContent = data.about;
}

// Auto-update every 5 sec
setInterval(loadSiteData, 5000);
loadSiteData();

// Language switch
languageSelect.addEventListener('change', () => {
    currentLanguage = languageSelect.value;
    userInput.placeholder = currentLanguage === 'en' ? "Type your message..." : "Message লিখুন...";
});

// About modal
aboutBtn.addEventListener('click', () => aboutModal.style.display = 'block');
closeAbout.addEventListener('click', () => aboutModal.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target == aboutModal) aboutModal.style.display='none'; });

// Send message
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

async function sendMessage() {
    const msg = userInput.value.trim();
    if(!msg) return;
    addMessage(msg, 'user');
    userInput.value='';
    const botDiv = addMessage(currentLanguage==='en'?'Typing...':'লিখছে...','agent');
    try{
        const res = await fetch('/chat', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        botDiv.textContent = data.reply;
        scrollToBottom();
    }catch(err){
        botDiv.textContent = 'Error: '+err.message;
    }
}

function addMessage(text,type){
    const div = document.createElement('div');
    div.classList.add('message',type);
    div.textContent = text;
    messagesContainer.appendChild(div);
    scrollToBottom();
    return div;
}
function scrollToBottom(){ messagesContainer.scrollTop = messagesContainer.scrollHeight; }
