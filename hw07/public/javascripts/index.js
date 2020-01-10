// TODO 
// Add client side JavaScript

function main() {

    // display all questions
    const url = "/questions";
    getQuestions(url);

    const qModal = document.querySelector('#modal-question');
    const questionBtn = document.getElementById('btn-show-modal-question');

    const cancelBtn = document.querySelector(".close");

    // open ask question modal
    questionBtn.addEventListener("click", function(evt){
        qModal.setAttribute("style", "display: block");

    })

    // if user inputs a question and submits, should save into db
    const askQ = document.getElementById('create-question'); // ask button

    askQ.addEventListener("click", function(){  
        let questionText = document.getElementById('question-text').value;
        askQuestion(questionText); // call function to add question into db/display
        document.getElementById('question-text').value='';
    });

    // if user inputs an answer, save text input into database
    const submitAnswer = document.getElementById("create-answer");

    submitAnswer.addEventListener("click", function(evt){
        let answerText = document.getElementById('answer-text').value;
        answerQuestion(answerText); // call function to add an answer into the db
        document.getElementById('answer-text').value='';
    });

    // close modal when "cancel" is clicked
    cancelBtn.addEventListener("click", function(evt){
        qModal.setAttribute("style", "display: none");
    });

}

// when answer question button is clicked
function answerQuestion(answerText){

    const aID = document.getElementById('question-id').value;
    console.log(aID);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/questions/${aID}/answers/`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send("answer=" + answerText);

    xhr.addEventListener('load', function(evt){
        getJustAddedAnswer(`/questions/${aID}/answers/`, aID); 
    });

}

// events to happen after an answer has been added
function getJustAddedAnswer(url, aID){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('load', () => otherHandleData2(xhr, aID));
    xhr.addEventListener('error', handleError());
    xhr.send();
}

// should display the answer just added 
function otherHandleData2(xhr, aID){

    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        const main = document.querySelector("main");

        Object.keys(data).map(function(key){

            let questions = data[key]; // question objects
            console.log("passed aID: ", aID);

            for (let i = 0; i < questions.length; i++){
                if (questions[i]._id === aID){
                    const li = document.createElement('li');
                    const justAddedAnswers = questions[i].answers; 
                    const lastAnswer = justAddedAnswers[justAddedAnswers.length-1];
                    li.textContent = lastAnswer;
                    
                    const div = document.getElementById(aID);
                    console.log(div);

                    if (div !== null){
                        div.appendChild(li); 
                    } else {
                        main.appendChild(li); // appending to end of page, not individual divs 
                    }
                }
            }

        })
    
    } else {
        console.log('Did Not Get 2xx');
    }

}

// when 'add question' button is clicked
function askQuestion(questionText){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/questions/', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send("question=" + questionText);

    xhr.addEventListener('load', function(evt){
        getJustAddedQuestion('/questions/'); 
    });

}

// events to happen after a question has been added
function getJustAddedQuestion(url){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('load', () => otherHandleData(xhr));
    xhr.addEventListener('error', handleError());
    xhr.send();
}

// should display the newly added question
function otherHandleData(xhr){

    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        const main = document.querySelector("main");
        const aModal = document.querySelector('#modal-answer');

        for (let element of Object.keys(data)){
        
            let questions = data[element];

            const div = document.createElement('div');
            const aDiv = document.createElement('div');
            const h2 = document.createElement('h2');
            const justAdded = questions[questions.length-1].question; // retrieving newly added question
            h2.textContent = justAdded;

            // adding an add answer button for each question
            const answerBtn = document.createElement("input");
            answerBtn.setAttribute("type", "button");
            answerBtn.setAttribute("value", "Add an Answer");
            answerBtn.setAttribute("class", "answerBtn");
            aDiv.appendChild(answerBtn);

            // open answer question modal
            answerBtn.addEventListener("click", function(evt){
                aModal.setAttribute("style", "display: block");

                const id = document.getElementById('question-id');
                id.setAttribute("value", questions[questions.length-1]._id);   
                // console.log("just added id: ", id.value);  
                // console.log("just added obj: ", questions[questions.length-1]);

                // close answer modal if cancel button is clicked
                const closeAModal = document.querySelector("#answer-close");

                closeAModal.addEventListener("click", function(evt){
                    aModal.setAttribute("style", "display: none");
                });

            });

            div.appendChild(h2);
            div.appendChild(aDiv);
            main.appendChild(div);

        }
    
    } else {
        console.log('Did Not Get 2xx');
    }

}

// to display questions from db on initial load
function getQuestions(url){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('load', () => handleData(xhr));
    xhr.addEventListener('error', handleError());
    xhr.send();
}

function handleData(xhr){
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        const main = document.querySelector("main");
        const aModal = document.querySelector('#modal-answer');
        const qModal = document.querySelector("#modal-question");

        for (let element of Object.keys(data)){
        
            let questions = data[element];

            for (let i = 0; i < questions.length; i++){ // iterating through each question in db
                const h2 = document.createElement('h2');
                const aDiv = document.createElement('div');
                const q = questions[i].question;          
                
                h2.textContent = q;

                const a = questions[i].answers;

                for (let j = 0; j < a.length; j++){ // iterating through each answer
                    const li = document.createElement('li');
                    li.textContent = a[j];
                    h2.appendChild(li);
                }

                // adding an add answer button for each question
                const answerBtn = document.createElement("input");
                answerBtn.setAttribute("type", "button");
                answerBtn.setAttribute("value", "Add an Answer");
                answerBtn.setAttribute("class", "answerBtn");
                aDiv.appendChild(answerBtn);

                // set id of question to id of div
                const div = document.createElement('div');
                div.id = questions[i]._id;

                // open answer question modal
                answerBtn.addEventListener("click", function(evt){
                    aModal.setAttribute("style", "display: block");

                    // stores the question id into the specific input
                    const id = document.getElementById('question-id');
                    id.setAttribute("value", questions[i]._id);   
                    console.log(id.value);  

                    // close answer modal if cancel button is clicked
                    const closeAModal = document.querySelector("#answer-close");

                    closeAModal.addEventListener("click", function(evt){
                        aModal.setAttribute("style", "display: none");
                    });

                });

                // close question modal when submit button is clicked (re-displays home page)
                const submitBtn = document.getElementById('create-question');
                submitBtn.addEventListener("click", function(){
                    qModal.setAttribute("style", "display: none");
                })

                // close answer modal
                const submitABtn = document.getElementById('create-answer');
                submitABtn.addEventListener('click', function(evt){
                    aModal.setAttribute("style", "display: none");
                })

                div.appendChild(h2);
                div.appendChild(aDiv);
                main.appendChild(div);

            } 

        }

        console.log(xhr.responseText);

    } else {
        console.log('Did Not Get 2xx');
    }
}

function handleError(){
    console.log("Could not make request");
}

document.addEventListener("DOMContentLoaded", main);


