const typeButtons = document.querySelectorAll(".type-option");
const form = document.querySelector("#risk-form");
const result = document.querySelector("#result");
const formError = document.querySelector("#form-error");
const resetButton = document.querySelector("#reset-button");
const riskBadge = document.querySelector("#risk-badge");
const resultTitle = document.querySelector("#result-title");
const resultExplanation = document.querySelector("#result-explanation");
const tipsList = document.querySelector("#tips-list");

let selectedType = "SMS";

typeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedType = button.dataset.type;
    typeButtons.forEach((option) => {
      const isSelected = option === button;
      option.classList.toggle("selected", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

const warningSigns = {
  urgent: {
    score: 2,
    tip: "Pause. Scammers often use urgency so you do not have time to verify."
  },
  unknownLink: {
    score: 2,
    tip: "Do not tap the link. Open the organisation's official app or website yourself instead."
  },
  secret: {
    score: 3,
    tip: "Never share an OTP, password, PIN, or recovery code. Legitimate support will not ask for it."
  },
  money: {
    score: 3,
    tip: "Do not pay yet. Confirm the request using a trusted phone number or official contact."
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const answers = new FormData(form);
  const questionNames = Object.keys(warningSigns);
  const unanswered = questionNames.some((name) => !answers.get(name));

  if (unanswered) {
    formError.hidden = false;
    return;
  }

  formError.hidden = true;
  let score = 0;
  const tips = [];

  questionNames.forEach((name) => {
    if (answers.get(name) === "yes") {
      score += warningSigns[name].score;
      tips.push(warningSigns[name].tip);
    }
  });

  const risk = score >= 6 ? "high" : score >= 3 ? "medium" : "low";
  const explanations = {
    low: `This ${selectedType.toLowerCase()} shows few common warning signs, but stay cautious. If anything feels off, verify it independently.`,
    medium: `This ${selectedType.toLowerCase()} has some warning signs. Slow down and verify the sender before clicking, sharing information, or paying.`,
    high: `This ${selectedType.toLowerCase()} has several strong warning signs. Treat it as suspicious and do not click, reply, share secrets, or pay.`
  };

  riskBadge.textContent = `${risk[0].toUpperCase()}${risk.slice(1)} risk`;
  riskBadge.className = `risk-badge ${risk}`;
  resultTitle.textContent = `${risk[0].toUpperCase()}${risk.slice(1)} risk`;
  resultExplanation.textContent = explanations[risk];
  tipsList.innerHTML = "";
  (tips.length ? tips : ["Check the sender using contact details you already trust."]).forEach((tip) => {
    const item = document.createElement("li");
    item.textContent = tip;
    tipsList.appendChild(item);
  });
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

resetButton.addEventListener("click", () => {
  form.reset();
  result.hidden = true;
  formError.hidden = true;
  document.querySelector(".card").scrollIntoView({ behavior: "smooth", block: "start" });
});
