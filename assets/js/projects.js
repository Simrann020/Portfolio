(function () {
    const grid = document.getElementById("projectGrid");
    const search = document.getElementById("projectSearch");
    const filter = document.getElementById("tagFilter");
    const noResults = document.getElementById("noResults");
  
    if (!grid || !search || !filter) return;
  
    const cards = Array.from(grid.querySelectorAll(".project"));
  
    function norm(s) {
      return String(s || "").toLowerCase().trim();
    }
  
    function matches(card, q, tag) {
      const title = norm(card.querySelector(".project-title")?.textContent);
      const tags = norm(card.getAttribute("data-tags"));
      const summary = norm(card.querySelector(".project-summary")?.textContent);
  
      const qOk = !q || title.includes(q) || tags.includes(q) || summary.includes(q);
      const tagOk = tag === "all" || tags.split(/\s+/).includes(tag);
  
      return qOk && tagOk;
    }
  
    function apply() {
      const q = norm(search.value);
      const tag = norm(filter.value);
  
      let shown = 0;
      for (const card of cards) {
        const ok = matches(card, q, tag);
        card.hidden = !ok;
        if (ok) shown += 1;
      }
  
      if (noResults) noResults.hidden = shown !== 0;
    }
  
    search.addEventListener("input", apply);
    filter.addEventListener("change", apply);
  
    apply();
  })();
  