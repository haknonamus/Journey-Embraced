(function () {
  // Workshop form submissions
  function bindForm(fId, sId, mId, lbl) {
    var f = document.getElementById(fId);
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var b = f.querySelector('button[type="submit"]');
      if (b) {
        b.textContent = "Sending...";
        b.disabled = true;
      }
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(f)).toString(),
      })
        .then(function () {
          f.style.display = "none";
          var s = document.getElementById(sId);
          if (s) s.style.display = "block";
          setTimeout(function () {
            var m = document.getElementById(mId);
            if (m) {
              m.classList.remove("open");
              document.body.style.overflow = "";
              f.reset();
              f.style.display = "";
              s.style.display = "none";
            }
          }, 4000);
        })
        .catch(function () {
          if (b) {
            b.textContent = lbl;
            b.disabled = false;
          }
          alert("There was a problem. Please call 816-974-3389.");
        });
    });
  }
  bindForm("connectedForm", "connectedSuccess", "connectedModal", "Reserve My Spot");
  bindForm("recoverForm", "recoverSuccess", "recoverModal", "Reserve My Spot");
  bindForm("mentalForm", "mentalSuccess", "mentalModal", "Reserve My Spot");
  bindForm("anchoredForm", "anchoredSuccess", "anchoredModal", "Reserve My Spot");
  bindForm("singingForm", "singingSuccess", "singingModal", "Reserve My Spot");
})();
