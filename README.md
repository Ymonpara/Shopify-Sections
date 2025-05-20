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
    Product Template : {% if template contains 'product' %}{% endif %}
    Collection Template : {% if template contains 'collection' %}{% endif %}
    Product Ta : g{% if product.tags contains 'bundle-offer' %}{% endif %}
  </li>
</ol>

