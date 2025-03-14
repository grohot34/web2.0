document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById("insert-word").addEventListener("click", insertWord);

    function insertWord() {
        const textArea = document.getElementById("text-area");
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

        if (position === "before") {
            textArea = " " + textArea.prepend(span);
        } else {
            textArea = textArea.appendChild(span) + " ";
        }
    }
    const createBlogButton = document.getElementById("create-blog");
    createBlogButton.addEventListener("click", createBlog);

    function createBlog() {
        const textArea = document.getElementById("text-area");
        const blogSection = document.getElementById("blog-section");
        const blogText = textArea.innerHTML.trim();
        if (blogText != "<br>") {
            const newBlogPost = document.createElement("div");
        newBlogPost.classList.add("blog-post");
        newBlogPost.innerHTML = `<p>${blogText}</p>`;
        blogSection.appendChild(newBlogPost);
        
        textArea.innerHTML = null;
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


});
