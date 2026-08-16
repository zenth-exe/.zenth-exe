(function () {
  'use strict';

  var REDIRECT_URL = 'https://ehoron.net/';
  var DELAY_MS = 5000;
  var elapsed = 0;
  var redirected = false;
  var timerId = null;
  var countdownNumber = document.getElementById('countdownNumber');
  var countdownLabel = document.getElementById('countdownLabel');
  var timerProgress = document.getElementById('timerProgress');
  var continueButton = document.getElementById('continueButton');
  var copyButton = document.getElementById('copyButton');
  var copyStatus = document.getElementById('copyStatus');

  function redirect() {
    if (redirected) return;
    redirected = true;
    if (timerId) window.clearInterval(timerId);
    window.location.assign(REDIRECT_URL);
  }

  function updateCountdown() {
    elapsed += 100;
    var remaining = Math.ceil(Math.max(0, DELAY_MS - elapsed) / 1000);
    var progress = Math.min(elapsed / DELAY_MS, 1) * 100;
    if (countdownNumber) countdownNumber.textContent = String(remaining);
    if (countdownLabel) countdownLabel.textContent = remaining > 0 ? 'The destination is ready.' : 'Redirecting now...';
    if (timerProgress) timerProgress.style.width = progress + '%';
    if (elapsed >= DELAY_MS) redirect();
  }

  function copyLink() {
    var done = function () {
      if (copyStatus) copyStatus.textContent = 'Link copied to clipboard';
      if (copyButton) copyButton.textContent = 'COPIED';
      window.setTimeout(function () {
        if (copyStatus) copyStatus.textContent = 'Redirect link configured';
        if (copyButton) copyButton.textContent = 'COPY LINK';
      }, 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(REDIRECT_URL).then(done).catch(function () {});
      return;
    }

    var helper = document.createElement('textarea');
    helper.value = REDIRECT_URL;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    try { document.execCommand('copy'); done(); } catch (error) {}
    helper.remove();
  }

  if (continueButton) continueButton.addEventListener('click', redirect);
  if (copyButton) copyButton.addEventListener('click', copyLink);
  timerId = window.setInterval(updateCountdown, 100);
}());
