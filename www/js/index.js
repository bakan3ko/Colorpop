//Device Ready function
//Game Scripts

$(function(){
  circleID = 1;

  colorPalette = [ '#22A7F0', '#26C281', '#875F9A', '#F08F90', '#D24D57', '#F4D03F', '#6C7A89', '#FFA631', '#A87CA0'  ]
  bgColorPalette = []; //for background animation
  gameColorPalette = []; //for game
  mainColor = '';
  rightColor = 0;
  degree = 0;
  score = 0;
  topScore = localStorage.getItem('topScore');
  timer = 22;
  clock = 1000; //decrease timer every second

  bgColorPalette = shuffle(colorPalette);
  bgSpawnCircles();

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function bgSpawnCircles(){
    ranX = Math.floor(Math.random() * 3);
    ranY = -50 + Math.floor(Math.random() * 150);
    ranSize = 1 + Math.floor(Math.random() * 130);
    colorPicker = 1 + Math.floor(Math.random() * 8);
    $('#mainMenu').append('<div class="bgCircles ' + circleID + '"></div>');
    $('.' + circleID)
    .css('top', ranX + '%')
    .css('left', ranY + '%')
    .css('width', ranSize + 'px')
    .css('height', ranSize + 'px')
    .css('background', bgColorPalette[colorPicker])
    .animate({ opacity: 0.37, top: '100%' }, { duration: 3000, complete: function(){
      $(this).remove();
    }})
    circleID++;
    bgCircleInterval = setTimeout(bgSpawnCircles, 300);
  }

  function gameCircles() {
    if (degree == 225) { degree = 0; }
    gameColorPalette = shuffle(colorPalette);
    for (var i = 0; i < gameColorPalette.length; i++) {
      color = gameColorPalette[i];
      $('.gameColor' + i).css('background-color', color);
      $('.circleBundle').css('transform', 'rotate(' + degree + 'deg)');
      if (mainColor == color) {
        $('.gameColor' + i).removeClass('wrongColor')
        $('.gameColor' + i).addClass('rightColor')
      } else {
        $('.gameColor' + i).removeClass('rightColor')
        $('.gameColor' + i).addClass('wrongColor')
      }
    }
    degree += 45;
  }

  function ranMainColor() {
    ranColorPicker = Math.floor(Math.random() * colorPalette.length);
    $('.mainColor').css('background-color', colorPalette[ranColorPicker]);
    mainColor = colorPalette[ranColorPicker];
  }

  function startGame(){
    score = 0;
    timer = 22;
    clock = 1000;
    degree = 0;
    $('.score').text(score);
    $('.timer').text(timer);
    gameTimer();
    ranMainColor();
    gameCircles();
  }

  function endGame(){
    clearTimeout(timerInterval);
    $('.finalScore').text(score);

    if (topScore < score) {
      topScore = localStorage.topScore = score;
    }

    $('.topScore').text(topScore);
  }

  function hideAllSectionsExcept(id) {
    $('section:not(' + id + ')').css('display', 'none');
    $(id)
      .css('display', 'flex')
      .animate({ opacity: 1 }, { duration: 1000 });
  }

  function goTo(from, to) {
    $(from)
    // Other interesting animations can be done
    // .animate({ width: "95%", height: "95%" }, 500 )
    // .animate({ left: "-100%" },
    .animate({ opacity: 0 },
      {
        duration: 1000,
        complete: function(){
          hideAllSectionsExcept(to);
        }
      });
  }

  function addScore(){
    score++;
    $('.score').text(score);
  }

  function addTimer(){
    timer++;
  }

  function gameTimer() {
    timer--;
    $('.timer').text(timer);

    if(score == 10){
      clock = 800;
    } else if (score == 20) {
      clock = 600;
    }

    timerInterval = setTimeout(gameTimer, clock);

    if(timer == 0){
      endGame();
      goTo('#playGame','#gameOver');
    }

  }

  $(document).on('click', ".rightColor", function() {
    addScore();
    addTimer();
    ranMainColor();
    gameCircles();
  });

  $(document).on('click', ".wrongColor", function() {
    endGame();
    goTo('#playGame','#gameOver');
  });

  $('.btnPlay').click(function(){
    goTo('#mainMenu', '#playGame');
    clearTimeout(bgCircleInterval);
    startGame();
  });

  $('.btnPlayAgain').click(function(){
    goTo('#gameOver', '#playGame');
    startGame();
  });

  $('.btnMenuOver').click(function(){
    goTo('#gameOver', '#mainMenu');
    bgSpawnCircles();
  });

  $('.btnRules').click(function(){
    goTo('#mainMenu', '#gameRules');
    clearTimeout(bgCircleInterval);
  });

  $('.btnGameOver').click(function(){
    goTo('#mainMenu', '#gameOver');
    clearTimeout(bgCircleInterval);
  });

  $('.btnQuit').click(function(){
    endGame();
    bgSpawnCircles();
    goTo('#playGame', '#mainMenu');
  });

  $('.btnMenu').click(function(){
    bgSpawnCircles();
    goTo('#gameRules', '#mainMenu');
  });

  $('.copyrights').text('\u00A9' + (new Date).getFullYear() + ' PCCC');

})
