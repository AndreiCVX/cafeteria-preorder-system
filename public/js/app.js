// Small progressive enhancements. The site still works without JavaScript.
(function () {
  // Confirm dialogs and "stay where you were" after adding to the order
  document.addEventListener('submit', function (e) {
    var f = e.target;
    var msg = f.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) { e.preventDefault(); return; }
    if (f.hasAttribute('data-keep-scroll')) sessionStorage.setItem('keepScrollY', String(window.scrollY));
  });

  document.addEventListener('DOMContentLoaded', function () {
    var y = sessionStorage.getItem('keepScrollY');
    if (y !== null) { window.scrollTo(0, parseInt(y, 10)); sessionStorage.removeItem('keepScrollY'); }

    // Quantity steppers
    document.querySelectorAll('.stepper').forEach(function (s) {
      var input = s.querySelector('input');
      s.querySelectorAll('[data-step]').forEach(function (b) {
        b.addEventListener('click', function () {
          var min = parseInt(input.min || '1', 10), max = parseInt(input.max || '20', 10);
          var v = (parseInt(input.value, 10) || min) + parseInt(b.getAttribute('data-step'), 10);
          input.value = Math.max(min, Math.min(max, v));
        });
      });
    });

    // Pickup time shortcuts
    var pickup = document.getElementById('pickup_time');
    if (pickup) {
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var fmt = function (d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      };
      var soonest = new Date(Date.now() + 10 * 60000);
      pickup.min = fmt(soonest);
      document.querySelectorAll('[data-in-minutes]').forEach(function (b) {
        b.addEventListener('click', function () {
          var d = new Date(Date.now() + parseInt(b.getAttribute('data-in-minutes'), 10) * 60000);
          pickup.value = fmt(d);
          pickup.focus();
        });
      });
    }
  });
})();