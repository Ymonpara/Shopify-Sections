<ol>
  <li style="padding-bottom: 50px;">
    Icon SVG <br>
    {{- 'icon-reset.svg' | inline_asset_content -}}
  </li>
  <li>
    Add Css File Link <br>
    {{ 'component-card.css' | asset_url | stylesheet_tag }}
  </li>
</ol>

