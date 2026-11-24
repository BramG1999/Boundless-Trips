const travellerInput = document.querySelector("#travellers");
const travellerCount = document.querySelector("#traveller-count");
const decreaseButton = document.querySelector("#decrease-travellers");
const increaseButton = document.querySelector("#increase-travellers");
const departureDate = document.querySelector("#date-from");
const returnDate = document.querySelector("#date-to");
const searchForm = document.querySelector("#trip-search-form");
const formMessage = document.querySelector("#form-message");

let travellers = Number(travellerInput.value);

function updateTravellerCount() {
  travellerInput.value = travellers;
  travellerCount.textContent = travellers;
  decreaseButton.disabled = travellers <= 1;
  decreaseButton.setAttribute("aria-disabled", String(travellers <= 1));
}

decreaseButton.addEventListener("click", () => {
  if (travellers > 1) {
    travellers -= 1;
    updateTravellerCount();
  }
});

increaseButton.addEventListener("click", () => {
  if (travellers < 9) {
    travellers += 1;
    updateTravellerCount();
  }
});

function formatDate(dateString) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateString}T12:00:00`));
}

// Prevent selecting travel dates in the past.
const today = new Date();
const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

departureDate.min = todayString;
returnDate.min = todayString;

departureDate.addEventListener("change", () => {
  returnDate.min = departureDate.value || todayString;

  if (returnDate.value && returnDate.value < departureDate.value) {
    returnDate.value = departureDate.value;
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!searchForm.reportValidity()) return;

  const formData = new FormData(searchForm);
  const city = formData.get("departure").trim();
  const budget = Number(formData.get("budget"));
  const start = formatDate(formData.get("dateFrom"));
  const end = formatDate(formData.get("dateTo"));

  if (new Date(`${formData.get("dateTo")}T00:00:00`) <
      new Date(`${formData.get("dateFrom")}T00:00:00`)) {
    returnDate.setCustomValidity("Return date must be on or after your departure date.");
    returnDate.reportValidity();
    returnDate.setCustomValidity("");
    return;
  }

  formMessage.textContent =
    `Trip search is coming soon! We'll look for routes from ${city} ` +
    `between ${start} and ${end}, with a transport budget of €${budget} ` +
    `per person for ${travellers} ${travellers === 1 ? "traveller" : "travellers"}.`;

  formMessage.classList.add("is-visible");
});

updateTravellerCount();