class MemoryGame {
  order = [];
  round;
  last_round_result;
  best_result;

  sequence_is_presenting;

  round_counter_element;
  cards_container_element;
  cards_elements = [];
  last_round_stat_element;
  best_round_stat_element;

  static CARDS_CSS_COLORS = [
    "#972e2e",
    "#c55c93",
    "#893795",
    "#3f49ab",
    "#2394a3",
    "#c1bf2d",
    "#cd5c35"
  ];

  constructor(container_element) {
    if (MemoryGame.isStorageEnabled()) {
      this.last_round_result = localStorage.getItem("last_round_result");
      this.best_result       = localStorage.getItem("best_result");

      if (typeof this.last_round_result === "string") {
        this.last_round_result = +this.last_round_result;
      }
      if (typeof this.best_result === "string") {
        this.best_result = +this.best_result;
      }
    }

    this.createDOM(container_element);
    this.addEventToCards();

    this.round = 1;
    this.refreshRound();
    this.getNewOrder();
    this.presentOrder();
  }

  static isStorageEnabled() {
    return (typeof(Storage) !== "undefined") && navigator.cookieEnabled;
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  getNewOrder() {
    this.order = [];

    for (let i = 0; i < this.round; i++) {
      const field_number = MemoryGame.getRandomInt(0, 8);
      this.order.push(field_number);
    }
  }

  refreshStats() {
    this.last_round_stat_element.textContent = "Last round result: " + 
      (this.last_round_result ?? "--");

    this.best_round_stat_element.textContent = "The best result: " +
      (this.best_result ?? "--");
  }

  refreshRound() {
    this.round_counter_element.textContent = "Round " + this.round;
  }

  createDOM(container_element) {
    this.round_counter_element    = document.createElement("div");
    this.round_counter_element.id = "round_counter";

    this.cards_container_element    = document.createElement("div");
    this.cards_container_element.id = "cards";

    const stats_container_element = document.createElement("div");
    stats_container_element.id    = "stats";

    this.last_round_stat_element    = document.createElement("div");
    this.last_round_stat_element.id = "last_round";

    this.best_round_stat_element    = document.createElement("div");
    this.best_round_stat_element.id = "best_round";

    stats_container_element.appendChild(this.last_round_stat_element);
    stats_container_element.appendChild(this.best_round_stat_element);

    this.refreshStats();

    for (let i = 0; i < 9; i++) {
      const card = document.createElement("div");
      card.classList.add("card");

      this.cards_elements.push(card);
      this.cards_container_element.appendChild(card);
    }

    container_element.appendChild(this.round_counter_element);
    container_element.appendChild(this.cards_container_element);
    container_element.appendChild(stats_container_element);
  }

  addEventToCards() {
    this.cards_container_element.addEventListener("click", (event) => {
      const clicked_element = event.target;

      if (this.cards_elements.includes(clicked_element)) {
        const card_index = this.cards_elements.indexOf(clicked_element);
        this.clickedCard(card_index);
      }
    });
  }

  correctAnswer(card_index) {
    this.cards_elements[card_index].classList.add("area_good_answer");
    setTimeout(() => {
      this.cards_elements[card_index].classList.remove("area_good_answer");
    }, 300)
  }

  wrongAnswer(card_index) {
    this.cards_elements[card_index].classList.add("area_wrong_answer");
    setTimeout(() => {
      this.cards_elements[card_index].classList.remove("area_wrong_answer");
    }, 300)
  }

  clickedCard(card_index) {
    if (!this.sequence_is_presenting) {      
      const correct_card = this.order.shift();

      if (correct_card !== undefined) {
        if (correct_card === card_index) {
          this.correctAnswer(card_index);
          if (this.order.length === 0) {
            this.last_round_result = this.round;

            if (this.last_round_result > this.best_result) {
              this.best_result = this.last_round_result;
            }

            if (MemoryGame.isStorageEnabled()) {
              localStorage.setItem("last_round_result", this.last_round_result);
              localStorage.setItem("best_result", this.best_result);
            }

            this.refreshStats();

            this.round++;
            this.refreshRound();

            this.getNewOrder();
            this.presentOrder();
          }
        }
        else {
          this.wrongAnswer(card_index);
          this.correctAnswer(correct_card);
          this.round = 1;
          this.refreshRound();
          this.getNewOrder();
          this.presentOrder();
        }
      }
    }
    else {
      alert('Start entering answers only after highlighting the number of squares equal to the number of rounds');
    }
  }

  highlightCard(card_index) {
    const last_color_index = MemoryGame.CARDS_CSS_COLORS.length - 1;
    const card_color = MemoryGame.CARDS_CSS_COLORS[
      MemoryGame.getRandomInt(0, last_color_index)
    ];

    this.cards_elements[card_index].style.backgroundColor = card_color;
    this.cards_elements[card_index].classList.add("highlighted_area_style");
  }

  removeHighlightCard(card_index) {
    this.cards_elements[card_index].style.backgroundColor = "";
    this.cards_elements[card_index].classList.remove("highlighted_area_style");
  }

  presentOrder() {
    this.sequence_is_presenting = true;

    for (let i = 0; i < this.round; i++) {
      const card_index = this.order[i];
      setTimeout(() => this.highlightCard(card_index), (1000 * i) + 1000);
      setTimeout(() => this.removeHighlightCard(card_index), (1000 * i) + 1750);
    }
    setTimeout(() => {
      this.sequence_is_presenting = false
    }, (this.round * 1000) + 750);
  }
}

export default MemoryGame;
