
/*!
 * Project : simply-countdown
 * Version : 1.3.2 (Fixed UTC)
 */
(function (exports) {
  "use strict";

  var extend, createElements, createCountdownElt, simplyCountdown;

  extend = function (out) {
    var i, obj, key;
    out = out || {};
    for (i = 1; i < arguments.length; i += 1) {
      obj = arguments[i];
      if (obj) {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === "object") {
              extend(out[key], obj[key]);
            } else {
              out[key] = obj[key];
            }
          }
        }
      }
    }
    return out;
  };

  createCountdownElt = function (countdown, parameters, typeClass) {
    var innerSectionTag, sectionTag, amountTag, wordTag;
    sectionTag = document.createElement("div");
    amountTag = document.createElement("span");
    wordTag = document.createElement("span");
    innerSectionTag = document.createElement("div");
    innerSectionTag.appendChild(amountTag);
    innerSectionTag.appendChild(wordTag);
    sectionTag.appendChild(innerSectionTag);
    sectionTag.classList.add(parameters.sectionClass);
    sectionTag.classList.add(typeClass);
    amountTag.classList.add(parameters.amountClass);
    wordTag.classList.add(parameters.wordClass);
    countdown.appendChild(sectionTag);
    return { full: sectionTag, amount: amountTag, word: wordTag };
  };

  createElements = function (parameters, countdown) {
    var spanTag;
    if (!parameters.inline) {
      return {
        days: createCountdownElt(countdown, parameters, "simply-days-section"),
        hours: createCountdownElt(countdown, parameters, "simply-hours-section"),
        minutes: createCountdownElt(countdown, parameters, "simply-minutes-section"),
        seconds: createCountdownElt(countdown, parameters, "simply-seconds-section"),
      };
    }
    spanTag = document.createElement("span");
    spanTag.classList.add(parameters.inlineClass);
    return spanTag;
  };

  simplyCountdown = function (elt, args) {
    var parameters = extend({
        year: 2025,
        month: 11,
        day: 30,
        hours: 0,
        minutes: 0,
        seconds: 0,
        words: {
          days: "day",
          hours: "hour",
          minutes: "minute",
          seconds: "second",
          pluralLetter: "s",
        },
        plural: true,
        inline: false,
        enableUtc: true,
        onEnd: function () { return; },
        refresh: 1000,
        inlineClass: "simply-countdown-inline",
        sectionClass: "simply-section",
        amountClass: "simply-amount",
        wordClass: "simply-word",
        zeroPad: false,
      }, args),
      interval, targetDate, now, secondsLeft, days, hours, minutes, seconds,
      cd = document.querySelectorAll(elt);

    const localDate = new Date(
      parameters.year,
      parameters.month - 1,
      parameters.day,
      parameters.hours,
      parameters.minutes,
      parameters.seconds
    );

    targetDate = parameters.enableUtc
      ? new Date(Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes(),
          localDate.getSeconds()
        ))
      : localDate;

    Array.prototype.forEach.call(cd, function (countdown) {
      var fullCountDown = createElements(parameters, countdown);
      var refresh = function () {
        now = new Date();
        secondsLeft = (targetDate.getTime() - now.getTime()) / 1000;
        if (secondsLeft > 0) {
          days = parseInt(secondsLeft / 86400, 10);
          secondsLeft %= 86400;
          hours = parseInt(secondsLeft / 3600, 10);
          secondsLeft %= 3600;
          minutes = parseInt(secondsLeft / 60, 10);
          seconds = parseInt(secondsLeft % 60, 10);
        } else {
          days = hours = minutes = seconds = 0;
          window.clearInterval(interval);
          parameters.onEnd();
        }

        var dayWord = parameters.plural && days !== 1 ? parameters.words.days + parameters.words.pluralLetter : parameters.words.days;
        var hourWord = parameters.plural && hours !== 1 ? parameters.words.hours + parameters.words.pluralLetter : parameters.words.hours;
        var minuteWord = parameters.plural && minutes !== 1 ? parameters.words.minutes + parameters.words.pluralLetter : parameters.words.minutes;
        var secondWord = parameters.plural && seconds !== 1 ? parameters.words.seconds + parameters.words.pluralLetter : parameters.words.seconds;

        if (parameters.inline) {
          countdown.innerHTML = `${days} ${dayWord}, ${hours} ${hourWord}, ${minutes} ${minuteWord}, ${seconds} ${secondWord}.`;
        } else {
          fullCountDown.days.amount.textContent = (parameters.zeroPad && days < 10 ? "0" : "") + days;
          fullCountDown.days.word.textContent = dayWord;
          fullCountDown.hours.amount.textContent = (parameters.zeroPad && hours < 10 ? "0" : "") + hours;
          fullCountDown.hours.word.textContent = hourWord;
          fullCountDown.minutes.amount.textContent = (parameters.zeroPad && minutes < 10 ? "0" : "") + minutes;
          fullCountDown.minutes.word.textContent = minuteWord;
          fullCountDown.seconds.amount.textContent = (parameters.zeroPad && seconds < 10 ? "0" : "") + seconds;
          fullCountDown.seconds.word.textContent = secondWord;
        }
      };
      refresh();
      interval = window.setInterval(refresh, parameters.refresh);
    });
  };

  exports.simplyCountdown = simplyCountdown;
})(window);
