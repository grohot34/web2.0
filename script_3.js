document.addEventListener("DOMContentLoaded", function () {
    const textArea = document.getElementById("text-area");
    function addPlaceholder() {
        if (textArea.innerHTML.trim() === "") {
            textArea.innerHTML = '<span class="placeholder" style="color: rgb(30, 28, 28); font-style: italic;">Напишите название для нового блога...</span>';
        }
    }

    addPlaceholder();

    textArea.addEventListener("input", function () {
        const placeholder = textArea.querySelector(".placeholder");
        if (textArea.innerHTML.trim() !== "" && placeholder) {
            placeholder.remove();
        }
    });

    textArea.addEventListener("focus", function () {
        const placeholder = textArea.querySelector(".placeholder");
        if (placeholder) {
            placeholder.remove();
        }
    });

    textArea.addEventListener("blur", function () {
        addPlaceholder();
    });

    document.getElementById("insert-word").addEventListener("click", insertWord);

    function insertWord() {
        const word = document.getElementById("word-list").value;
        const style = document.getElementById("text-style").value;
        const size = document.getElementById("font-size").value;
        const color = document.getElementById("text-color").value;
        const position = document.querySelector("input[name='position']:checked").value;
    
        if (!word) return;
    
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.fontStyle = style === "italic" ? "italic" : "normal";
        span.style.fontWeight = style === "bold" ? "bold" : "normal";
        span.style.fontSize = size;
        span.style.color = color;
    
        const placeholder = textArea.querySelector(".placeholder");
        if (placeholder) {
            placeholder.remove();
        }
    
        if (position === "before") {
            if (textArea.innerHTML.trim() === "") {
                textArea.innerHTML = '';
            }
            textArea.insertBefore(span, textArea.firstChild);
        } else if (position === "after") {
            if (textArea.innerHTML.trim() !== "" && !textArea.innerHTML.endsWith(" ")) {
                textArea.innerHTML += ' ';
            }
            textArea.innerHTML += span.textContent;
        }
    }
    

    document.getElementById('add-word-button').addEventListener('click', function() {
        var newWord = document.getElementById('new-word').value.trim();

        if (newWord) {
            var wordList = document.getElementById('word-list');
            var newOption = document.createElement('option');
            newOption.value = newWord;
            newOption.text = newWord;

            var lastOption = wordList.querySelector('option:last-child');
            wordList.insertBefore(newOption, lastOption);

            document.getElementById('new-word').value = '';
        }
    });

    textArea.addEventListener("click", function (event) {
        const placeholder = textArea.querySelector(".placeholder");
        if (placeholder) {
            setCaretPosition(0);
        }
    });

    function setCaretPosition(position) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(textArea.childNodes[0], position); 
        range.setEnd(textArea.childNodes[0], position);   
        selection.removeAllRanges();
        selection.addRange(range);
    }
});
