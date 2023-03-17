function draw_number(min, max){  // 4; 6
  min = parseInt(min, 10);
  max = parseInt(max, 10);
  if (min > max){
    let tmp = min;
    min = max;
    max = tmp;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let sequence_is_presented = false;  // Przechowuje informacje, czy klikanie w przycisk będzie dziłać
let round = 1;                      // numer rundy
let order = [];                     // tablica order
let index_of_order = 0;             // Aktualny index tablicy order
let last_round_result;
let best_result;

function clicked_field(field) {  // 9 user interaction
  if (sequence_is_presented) {
    function good_answer(field) {
      function good_answer_remove() {
        document.getElementById(`card${field}`).classList.remove('area_good_answer');
      }
      document.getElementById(`card${field}`).classList.add('area_good_answer');
      setTimeout(good_answer_remove, 300);
    }
    function wrong_answer(field) {
      function wrong_answer_remove() {
        document.getElementById(`card${field}`).classList.remove('area_wrong_answer');
      }
      document.getElementById(`card${field}`).classList.add('area_wrong_answer');
      setTimeout(wrong_answer_remove, 300);
    }
    if (order[index_of_order] === field) {
      good_answer(order[index_of_order]);
      if ((index_of_order + 1) >= order.length) {
        round++;
        index_of_order = 0;

        setTimeout(start, 400);
      } else {
        index_of_order++;
      }
    } else {
      localStorage.setItem('last_round_result', (round - 1));
      last_round_result = localStorage.getItem('last_round_result');
      if (last_round_result > best_result) {
        localStorage.setItem('best_result', (round - 1));
      }
      wrong_answer(field);
      good_answer(order[index_of_order]);
      round = 1;
      index_of_order = 0;
      setTimeout(start, 400);
    }
  } else {
    window.alert('Wprowadzanie odpowiedzi należy zacząć dopiero po podświetleniu ilości pul równej liczbie rund');
  }
} 

function start() {  // 1 (user interaction); 10; 11
  sequence_is_presented = false;
  // last_round_result = localStorage.getItem('');  // TODO
  
  last_round_result = localStorage.getItem('last_round_result');
  best_result = localStorage.getItem('best_result');

  if (last_round_result === null) {
    last_round_result = 0;
  }
  if (best_result === null) {
    best_result = 0;
  }

  document.querySelector('body').innerHTML = `<div id="round_counter">Runda ${round}</div>` + '<div id="cards"><div class="card" id="card1" onclick="clicked_field(1)"></div><div class="card" id="card2" onclick="clicked_field(2)"></div><div class="card" id="card3" onclick="clicked_field(3)"></div><div class="card" id="card4" onclick="clicked_field(4)"></div><div class="card" id="card5" onclick="clicked_field(5)"></div><div class="card" id="card6" onclick="clicked_field(6)"></div><div class="card" id="card7" onclick="clicked_field(7)"></div><div class="card" id="card8" onclick="clicked_field(8)"></div><div class="card" id="card9" onclick="clicked_field(9)"></div></div>' + `<div class="statistics">Wynik ostatniej rundy: ${last_round_result}</div><div class="statistics">Najlepszy wynik: ${best_result}</div>`;
  function draw_order(round) {  // 3
    order = [];
    for (i = 1; i <= round; i++) {
      order.push(draw_number(1, 9));
    }
  }

  function present_order(round) {  // 2
    draw_order(round);
    function field_color_remove(round) {  // 7
      for (i = 1; i <= 9; i++) {
        document.querySelector(`#card${order[round - 1]}`).classList.remove(`area_style${i}`);
      }
    }
    function field_color_add(round) {  // 5
      document.querySelector(`#card${order[round - 1]}`).classList.add(`area_style${draw_number(1, 7)}`);
      setTimeout(field_color_remove, 750, round);
    }
    for (i = 1; i <= round; i++) {
      setTimeout(field_color_add, (1000 * i), i);
    }
    function sequence_is_presented_function(value) {  // 8
      sequence_is_presented = value;
    }
    setTimeout(sequence_is_presented_function, ((1000 * round) + 500), true);
  }
  present_order(round);
}
