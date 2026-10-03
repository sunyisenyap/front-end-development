interface FlashCard {
  questionText: string;
  questionAnswer: string;
}

class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
  }
}

let currentCards: FlashCard[] = [
  { questionText: "What does HTML stand for?", questionAnswer: "HyperText Markup Language" },
  { questionText: "Which keyword declares a constant in TypeScript?", questionAnswer: "const" },
  { questionText: "What does CSS stand for?", questionAnswer: "Cascading Style Sheets" },
];

let currentIndex = 0;

const flashcardEl = document.getElementById("flashcard") as HTMLElement;
const frontDisplay = document.getElementById("front-display") as HTMLElement;
const backDisplay = document.getElementById("back-display") as HTMLElement;
const counterEl = document.getElementById("counter") as HTMLElement;
const deleteBtn = document.getElementById("delete-btn") as HTMLButtonElement;
const entryForm = document.getElementById("entry-form") as HTMLFormElement;
const frontText = document.getElementById("front-text") as HTMLTextAreaElement;
const backText = document.getElementById("back-text") as HTMLTextAreaElement;
const errorMsg = document.getElementById("error-msg") as HTMLElement;

function renderCard(): void {
  flashcardEl.classList.remove("flipped");

  if (currentCards.length === 0) {
    frontDisplay.textContent = "No cards left. Add one below.";
    backDisplay.textContent = "";
    counterEl.textContent = "0 cards";
    return;
  }

  const card = currentCards[currentIndex];
  frontDisplay.textContent = card.questionText;
  backDisplay.textContent = card.questionAnswer;
  counterEl.textContent = `Card ${currentIndex + 1} of ${currentCards.length}`;
}

flashcardEl.addEventListener("click", () => {
  flashcardEl.classList.toggle("flipped");
});

deleteBtn.addEventListener("click", () => {
  if (currentCards.length === 0) return;

  currentCards.splice(currentIndex, 1);
  currentIndex = Math.max(0, currentIndex - 1);
  renderCard();
});

entryForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  const question = frontText.value.trim();
  const answer = backText.value.trim();

  if (question === "" || answer === "") {
    errorMsg.textContent = "Both the question and the answer are required.";
    throw new InvalidUserInputError(
      "Question text and answer must not be empty."
    );
  }

  errorMsg.textContent = "";
  currentCards.push({ questionText: question, questionAnswer: answer });
  currentIndex = currentCards.length - 1;
  entryForm.reset();
  renderCard();
});

renderCard();