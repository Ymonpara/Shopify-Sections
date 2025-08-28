<ol>
  <li>
    Icon SVG <br>
    {{- 'icon-reset.svg' | inline_asset_content -}}
  </li>
  <br>
  <li>
    Add Css File Link <br>
    {{ 'component-card.css' | asset_url | stylesheet_tag }}
  </li>
  <br>
  <li>
    First Tab Active Class Add <br>
    {{ 'component-card.css' | asset_url | stylesheet_tag }}
  </li>
  <br>
  <li>
    Add Class as The Name of Page <br>
    {{ page_title | handle }}
  </li>
  <br>
  <li>
    Show Content <br>
    Product Template <br> {% if template contains 'product' %}{% endif %} <br>
    Collection Template <br> {% if template contains 'collection' %}{% endif %} <br>
    Product Tag <br> {% if product.tags contains 'bundle-offer' %}{% endif %}
  </li>
  <br>
  <li>
    For Loop In Star <br>
    {% for i in (1..5) %} <br>
      {% liquid <br>
        if i <= block.settings.rating <br>
          assign active = true <br> 
        else <br>
          assign active = false <br>
        endif <br>
      %} <br>
      /* Star Code */ <br>
    {% endfor %}
  </li>
  <li>
    Mega Menu Hover JS<br>
    // Menu Hover Start 
let items = document.querySelectorAll(".header__inline-menu details");

items.forEach(item => {
  const menu = item.querySelector("ul");

  // Open on mouse enter
  item.addEventListener("mouseenter", () => {
    item.setAttribute("open", true);
  });

  // Close when leaving the whole <details> area
  item.addEventListener("mouseleave", () => {
    item.removeAttribute("open");
  });

  // Extra safety: if mouse leaves the UL itself
  if (menu) {
    menu.addEventListener("mouseleave", () => {
      item.removeAttribute("open");
    });
  }
});
  </li>
  <br>
  <li>
    For Richtext <br>
    assign plain_text = block.settings.text | strip_newlines | strip_html | strip
  </li>
</ol>

