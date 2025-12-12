document.addEventListener('DOMContentLoaded', function () {
    const scenes = document.querySelectorAll('.scene');
    const bgm = document.getElementById('bgm');
    let isTyping = false;
    let typeInterval;
    const btnOpenGift = document.getElementById('btn-open-gift');
    if(btnOpenGift) {
        btnOpenGift.addEventListener('click', () => {
            switchScene('scene-author');
            if(bgm && bgm.paused) {
                bgm.volume = 0.4;
                bgm.play().catch(e => console.log('Autoplay prevented'));
            }
        });
    }
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.option-btn')) {
            const btn = e.target.closest('.option-btn');
            const nextId = btn.getAttribute('data-next');
            if (nextId) {
                switchScene(nextId);
            }
        }
        if (isTyping && e.target.closest('.dialog-box')) {
            finishTypingImmediately();
        }
    });
    function switchScene(sceneId) {
        scenes.forEach(scene => scene.classList.remove('active'));
        const targetScene = document.getElementById(sceneId);
        if (targetScene) {
            targetScene.classList.add('active');
            clearInterval(typeInterval);
            isTyping = false;
            const textLines = targetScene.querySelectorAll('.type-text');
            const optionsContainer = targetScene.querySelector('.options-container');
            if (optionsContainer) {
                optionsContainer.classList.remove('show');
            }

            if (textLines.length > 0) {
                startTypewriter(textLines, optionsContainer);
            } else if (targetScene.querySelector('.text-typewriter')) {
                const authorBtn = targetScene.querySelector('.center-btn');
                startTypewriter(targetScene.querySelectorAll('.text-typewriter p'), authorBtn, 50);
            }
        }
    }
    let currentTypingElements = []; 
    function startTypewriter(elements, callbackElement, speed = 40) {
        isTyping = true;
        currentTypingElements = Array.from(elements);
        const contents = [];
        currentTypingElements.forEach(el => {
            contents.push(el.innerHTML);
            el.innerHTML = '';
            el.style.opacity = '1'; 
        });
        let lineIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let currentEl = currentTypingElements[0];
        function type() {
            if (lineIndex >= contents.length) {
                isTyping = false;
                clearInterval(typeInterval);
                if (callbackElement) {
                    callbackElement.classList.add('show');
                }
                return;
            }
            const fullText = contents[lineIndex];
            if (charIndex < fullText.length) {
                currentEl.innerHTML += fullText.charAt(charIndex);
                charIndex++;
            } else {
                lineIndex++;
                charIndex = 0;
                if (lineIndex < contents.length) {
                    currentEl = currentTypingElements[lineIndex];
                }
            }
        }
        typeInterval = setInterval(type, speed);
    }
    function finishTypingImmediately() {
        clearInterval(typeInterval);
        isTyping = false;
        const activeScene = document.querySelector('.scene.active');
        if(!activeScene) return;
        
        const options = activeScene.querySelector('.options-container');
        if(options) options.classList.add('show');
    }
    const originalTexts = new Map();
    document.querySelectorAll('.type-text, .text-typewriter p').forEach(el => {
        el.setAttribute('data-full-text', el.innerHTML);
    });
    window.startTypewriter = function(elements, optionsContainer, speed = 30) {
        isTyping = true;
        let queue = [];
        elements.forEach(el => {
            el.innerHTML = ''; 
            queue.push({
                el: el,
                text: el.getAttribute('data-full-text')
            });
        });
        let qIndex = 0;
        let charIndex = 0;
        typeInterval = setInterval(() => {
            if (qIndex >= queue.length) {
                clearInterval(typeInterval);
                isTyping = false;
                if(optionsContainer) optionsContainer.classList.add('show');
                return;
            }
            const currentItem = queue[qIndex];
            currentItem.el.innerHTML += currentItem.text.charAt(charIndex);
            charIndex++;

            if (charIndex >= currentItem.text.length) {
                qIndex++;
                charIndex = 0;
            }
        }, speed);
        window.currentSkip = function() {
            clearInterval(typeInterval);
            queue.forEach(item => {
                item.el.innerHTML = item.text;
            });
            isTyping = false;
            if(optionsContainer) optionsContainer.classList.add('show');
        }
    }
    window.finishTypingImmediately = function() {
        if(window.currentSkip) window.currentSkip();
    }
});