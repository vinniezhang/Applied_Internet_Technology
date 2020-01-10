document.addEventListener('DOMContentLoaded', main);

// main.js
function main(){

    let userCards;
    let computerCards;
    let deck;
    const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    // comp div
    const compDiv = document.createElement('div');
    compDiv.setAttribute('id', 'compDiv');
    const comp1 = document.createElement("img");

    // user div
    const userDiv = document.createElement('div');
    userDiv.setAttribute('id', 'userDiv');

    // user hand
    const userText = document.createElement('p');
    let userTotal = 0;
    let toAdd;

    // comp hand
    let compMathTotal = 0;
    const compText = document.createElement('p');
    const compTotal = "?";

    // hiding start box on submit
    document.querySelector('input[type="submit"]').addEventListener("click", function(event){
        document.querySelector(".start").setAttribute("style", "display: none");

        // logic for generating deck of cards
        deck = [];
        
        // populating deck with 4 of each card
        for (let i = 0; i < 13; i++){ // 13 is the number of total card types --> total is 52
            for (let j = 0; j < 4; j++){
                deck.push(cards[i]); 
            }
        }

        // shuffling deck
        shuffleDeck(deck);
        console.log("SHUFFLED: ", deck);

        // logic for placing user start values in the front of the deck
        const startingValues = document.querySelector('input[type=text]').value;
        computerCards = [];
        userCards = [];

        if (startingValues !== ""){ // user entered starting values

            const startArray = startingValues.split(',');
            console.log(startArray);

            for (let i = 0; i < startArray.length; i++){ // iterate through start values
                for (let j = 4; j < deck.length; j++) { // iterate through deck
                    // bringing start values to front of deck
                    if (startArray[i] === deck[j]){
                        const temp = deck[j];
                        deck[j] = deck[i];
                        deck[i] = temp;
                    }
                }
            }

            console.log("NEW DECK: ", deck);

            for (let i = 0; i < startArray.length; i++){

                if (i % 2 === 0) { // computer cards --> first card is dealt to computer
                    computerCards.push(deck[i]);
                } else { // user cards
                    userCards.push(deck[i]);
                }
            }

            generateComp();
            generateUser();
            generateButtons();

        } else { // if no specified starting values, just deal out the first 4 cards

            for (let i = 0; i < 4; i++){

                if (i % 2 === 0) { // computer cards --> first card is dealt to computer
                    computerCards.push(deck[i]);
                } else { // user cards
                    userCards.push(deck[i]);
                }
            }

            generateComp();
            generateUser();
            generateButtons();

        }

        console.log("COMP CARDS: ", computerCards);
        console.log("USER CARDS: ", userCards);

        function generateButtons(){

            const buttonDiv = document.createElement("div");
            buttonDiv.setAttribute("id", "buttonDiv");

            // hit button --> add another card
            const hit = document.createElement('input');
            hit.setAttribute("id", "hitBtn");
            hit.setAttribute("type", "submit");
            hit.setAttribute("value", "Hit");

            let currentCard = 4; // so the deck starts after the top 4

            hit.addEventListener("click", function(event){

                // add next card in deck to user's hand
                userCards.push(deck[currentCard]);

                // display that card
                const hitCard = document.createElement("img");
                hitCard.setAttribute("height", "180px");
                hitCard.setAttribute("src", "../images/" + deck[currentCard] + ".png");
                userDiv.appendChild(hitCard);

                // update the user hand total
                if (deck[currentCard] === "J" || deck[currentCard] === "Q" || deck[currentCard] === "K"){
                    toAdd = 10;
                } else if (deck[currentCard] === "A"){
                    if (userTotal + 11 <= 21){ // if A = 11 doesn't push it over
                        toAdd = 11;
                    } else {
                        toAdd = 1;
                    }
                } else {
                    toAdd = parseInt(deck[currentCard]);
                }

                userTotal += toAdd;
                userText.innerHTML = "User Hand - Total: " + userTotal; /// update total

                if (userTotal > 21){ // user loses, comp hand needs to display
                    hit.setAttribute("style", "display: none");
                    stand.setAttribute("style", "display: none");

                    // show comp hand
                    comp1.setAttribute("src", "../images/" + deck[0]+ ".png");
                    compText.innerHTML = "Computer Hand - Total: " + compMathTotal; // update total

                    const gameLost = document.createElement("p");
                    gameLost.innerHTML = "Player Lost (Bust!) ☹️";
                    buttonDiv.appendChild(gameLost);
                }

                currentCard++; // increment deck position

            })

            // stand button --> stay with current cards
            const stand = document.createElement('input');
            stand.setAttribute("id", "standBtn");
            stand.setAttribute("type", "submit");
            stand.setAttribute("value", "Stand");

            stand.addEventListener("click", function(event){

                comp1.setAttribute("src", "../images/" + deck[0]+ ".png");
                compText.innerHTML = "Computer Hand - Total: " + compMathTotal; // update total

                while ((compMathTotal + 4) < 21){ // as long as total is less than or equal to 17

                    computerCards.push(deck[currentCard]);

                    // add image of card to display
                    const standCard = document.createElement("img");
                    standCard.setAttribute("height", "180px");
                    standCard.setAttribute("src", "../images/" + deck[currentCard] + ".png");
                    compDiv.appendChild(standCard);

                    // increment compmath total
                    if (deck[currentCard] === "J" || deck[currentCard] === "Q" || deck[currentCard] === "K"){
                        toAdd = 10;
                    } else if (deck[currentCard] === "A"){
                        if (compMathTotal + 11 <= 21){ // if A = 11 doesn't push it over
                            toAdd = 11;
                        } else {
                            toAdd = 1;
                        }
                    } else {
                        toAdd = parseInt(deck[currentCard]);
                    }

                    compMathTotal += toAdd;
                    compText.innerHTML = "Computer Hand - Total: " + compMathTotal; // update total

                    console.log("COMP MATH TOTAL: ", compMathTotal);
                    console.log("JUST ADDED:", deck[currentCard]);
                    console.log("COMP CARDS: ", computerCards);

                    currentCard++;

                }

                hit.setAttribute("style", "display: none");
                stand.setAttribute("style", "display: none");

                if (compMathTotal > 21 && userTotal <= 21){
                    const gameWon = document.createElement("p");
                    gameWon.innerHTML = "Player Won! 💰💰💰";
                    buttonDiv.appendChild(gameWon);

                } else if (compMathTotal <= 21){ // computer hand is still in play

                    // all possible scenarios with both comp and user hands still in play
                    if (((21 - compMathTotal) > (21 - userTotal))) { // comp is further from 21, therefore comp loses
                        const gameWon = document.createElement("p");
                        gameWon.innerHTML = "Player Won! 💰💰💰";
                        buttonDiv.appendChild(gameWon);


                    } else if (compMathTotal === userTotal){
                        const gameTie = document.createElement("p");
                        gameTie.innerHTML = "Game Tied!";
                        buttonDiv.appendChild(gameTie);

                    } else { // user is further away from 21, therefore loses
                        const gameLost = document.createElement("p");
                        gameLost.innerHTML = "Player Lost (Bust!) ☹️";
                        buttonDiv.appendChild(gameLost);

                    }
                }  
                
                console.log("End Comp Score: ", compMathTotal);
                console.log("End User Score: ", userTotal);
                
            })

            buttonDiv.appendChild(hit);
            buttonDiv.appendChild(stand);

            document.body.appendChild(buttonDiv);
        }

        function generateComp(){

            // COMPUTER cards
            compText.innerHTML = "Computer Hand - Total: " + compTotal;
            document.body.appendChild(compText);
            
            // first card (not visible)
            comp1.setAttribute("height", "185px");
            comp1.setAttribute("src", "../images/red.png");

            // second card (visible)
            const comp2 = document.createElement("img");
            comp2.setAttribute("src", "../images/" + computerCards[1] + ".png");

            // displaying those first two cards
            compDiv.appendChild(comp1);
            compDiv.appendChild(comp2);
            document.body.appendChild(compDiv);

            // calculating computer card total
            for (let i = 0; i < computerCards.length; i++){

                if (computerCards[i] === "J" || computerCards[i] === "Q" || computerCards[i] === "K"){
                    toAdd = 10;
                } else if (computerCards[i] === "A"){
                    if (compMathTotal + 11 <= 21){ // if A = 11 doesn't push it over
                        toAdd = 11;
                    } else {
                        toAdd = 1;
                    }
                } else {
                    toAdd = parseInt(computerCards[i]);
                }

                compMathTotal += toAdd;

            }

            console.log("COMP MATH TOTAL: ", compMathTotal);

        }

        ////////////////////////////////////////////////////////

        function generateUser(){

            // USER cards
            // calculating user total
            for (let i = 0; i < userCards.length; i++){
                if (userCards[i] === "J" || userCards[i] === "Q" || userCards[i] === "K"){
                    toAdd = 10;
                } else if (userCards[i] === "A"){ // to account for Ace being either 1 or 11
                    if (userTotal + 11 <= 21){ // if A = 11 doesn't push it over
                        toAdd = 11;
                    } else {
                        toAdd = 1;
                    }
                } else {
                    toAdd = parseInt(userCards[i]);
                }

                userTotal += toAdd;
            }

            console.log("USER TOTAL: ", userTotal);

            userText.innerHTML = "User Hand - Total: " + userTotal;
            document.body.appendChild(userText);

            // first card (visible)
            const user1 = document.createElement("img");
            user1.setAttribute("src", "../images/" + userCards[0] + ".png");

            // second card (visible)
            const user2 = document.createElement("img");
            user2.setAttribute("src", "../images/" + userCards[1] + ".png");

            // displaying those first two cards
            userDiv.appendChild(user1);
            userDiv.appendChild(user2);
            document.body.appendChild(userDiv);

        }

        event.preventDefault();
    });

    // background image
    document.querySelector("body").setAttribute("background", "../images/wood_bg.jpg");

}

function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


