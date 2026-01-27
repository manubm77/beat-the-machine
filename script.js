document.addEventListener('DOMContentLoaded', () => {
    const mainInput = document.querySelector('.main-input');
    const sendBtn = document.querySelector('.send-btn');
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const menuBtn = document.querySelector('.menu-btn');

    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const text = card.textContent.trim();
            mainInput.value = text;
            mainInput.focus();
            
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });

    const handleSubmit = () => {
        const query = mainInput.value.trim();
        if (query) {
            console.log('Submitted query:', query);
            mainInput.value = '';
        }
    };

    sendBtn.addEventListener('click', handleSubmit);

    mainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });

    mainInput.addEventListener('input', () => {
        if (mainInput.value.trim()) {
            sendBtn.style.color = '#888';
        } else {
            sendBtn.style.color = '#555';
        }
    });

    menuBtn.addEventListener('click', () => {
        console.log('Menu clicked');
    });
});
