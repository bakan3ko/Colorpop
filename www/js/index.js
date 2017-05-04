//Device Ready function
//Game Scripts

$(function(){
  circleID = 1;

  colorPalette = [ '#E57373', '#9575CD', '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F', '#FF8A65', '#90A4AE', '#F06292'  ]
  bgColorPalette = []; //for background animation
  gameColorPalette = []; //for game
  mainColor = '';
  rightColor = 0;
  degree = 0;
  score = 0;
  topScore = localStorage.getItem('topScore');
  timer = 22;
  clock = 1000; //decrease timer every second
  adCount = 0;

  bgColorPalette = shuffle(colorPalette);


  setTimeout(function(){
    // $('.splashScreen').animate({opacity: 0}, {duration: 300, complete: function(){
    //   $('.splashScreen').css('top', '-100%');
    // }});

    $('.splashScreen').animate({ opacity: 0 },
      { duration: 500,
        complete: function(){
          $(this).remove();
    }})
    $('.copyrights').css('color', 'rgba(144,144,144,0.5)');
    bgSpawnCircles();
    playBG();

  }, 3000)

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
    if (degree == 225) { playSound('reverse.wav'); degree = 0; }
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
    playSound('gameover.aac');

    adCount++;

    if(adCount % 3 == 0){
      showInterstitialAd();
    }

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
    playSound('click.aac');
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

  function playBG(){
    audio = new Audio('bgm/bg.aac');
    audio.volume = 0.9;
    audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.play();
  }

  function playSound(sourceFile) {
    sound = new Audio('bgm/' + sourceFile);
    sound.volume = 0.3;
    sound.play();
  }

  function onPause() {
    audio.pause();
  }

  function onResume() {
    audio.play();
  }

  document.addEventListener("resume", onResume, false);
  document.addEventListener("pause", onPause, false);

  /////////////////  ADS START    ////////////////

var isPendingInterstitial = false;
var isAutoshowInterstitial = false;

function prepareInterstitialAd() {
    if (!isPendingInterstitial) { // We won't ask for another interstitial ad if we already have an available one
        admob.requestInterstitialAd({
            autoShowInterstitial: isAutoshowInterstitial
        });
    }
}

function onAdLoadedEvent(e) {
    if (e.adType === admob.AD_TYPE.INTERSTITIAL && !isAutoshowInterstitial) {
        isPendingInterstitial = true;
    }
}

function onDeviceReady() {
    document.removeEventListener('deviceready', onDeviceReady, false);

    admob.setOptions({
        publisherId:          "ca-app-pub-7080562633175785~3198912953",
        interstitialAdId:     "ca-app-pub-7080562633175785/4675646159",
    });

    document.addEventListener(admob.events.onAdLoaded, onAdLoadedEvent);
    prepareIntestitialAd();
}

document.addEventListener("deviceready", onDeviceReady, false);

function showInterstitialAd() {
    if (isPendingInterstitial) {
        admob.showInterstitialAd(function () {
                isPendingInterstitial = false;
                isAutoshowInterstitial = false;
                prepareInterstitialAd();
        });
    } else {
        // The interstitial is not prepared, so in this case, we want to show the interstitial as soon as possible
        isAutoshowInterstitial = true;
        admob.requestInterstitialAd({
            autoShowInterstitial: isAutoshowInterstitial
        });
    }
}

/////////////////  ADS END    ////////////////

//////////////// Share ///////////////////

$('.gameShare').click(function(){
  // this is the complete list of currently supported params you can pass to the plugin (all optional)
  var options = {
    message: 'Think your fast? Well think again! Play ColorPop now! #teamNyanku', // not supported on some apps (Facebook, Instagram)
    subject: 'ColorPop: Mobile Game', // fi. for email
    files: ['../img/icon.png'], // an array of filenames either locally or remotely
    url: 'https://play.google.com/store/apps/details?id=com.phonegap.colorpop',
    chooserTitle: 'ColorPop' // Android only, you can override the default share sheet title
  }

  var onSuccess = function(result) {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }

  var onError = function(msg) {
    console.log("Sharing failed with message: " + msg);
  }

  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
});

$('.scoreShare').click(function(){
  // this is the complete list of currently supported params you can pass to the plugin (all optional)
  var options = {
    message: 'I got a top score of ' + topScore + ' in ColorPop. Can you beat that? #teamNyanku', // not supported on some apps (Facebook, Instagram)
    subject: 'ColorPop: Top Score', // fi. for email
    files: ['../img/icon.png'], // an array of filenames either locally or remotely
    url: 'https://play.google.com/store/apps/details?id=com.phonegap.colorpop',
    chooserTitle: 'ColorPop' // Android only, you can override the default share sheet title
  }

  var onSuccess = function(result) {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }

  var onError = function(msg) {
    console.log("Sharing failed with message: " + msg);
  }

  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
});

//////////////// Share end //////////////////

  $(document).on('click', ".rightColor", function() {
    playSound('click.aac');
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

  $('.copyrights').text('\u00A9' + ' ' + (new Date).getFullYear() + ' Nyanku');

})
