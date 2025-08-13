<template>
  <div class="app">
    <NuxtPage />
    <footer class="footer">
      <p>
        Demo by GPT-5 · <a href="https://nuxt.com" target="_blank" rel="noreferrer">Nuxt 3</a>
      </p>
    </footer>
  </div>
</template>

<style>
:root {
  --bg: #0b1020;
  --panel: #121731;
  --panel-2: #0f1328;
  --text: #e6e8f0;
  --muted: #aab0c0;
  --primary: #6ea8fe;
  --primary-2: #4b89ff;
  --danger: #ff6b6b;
  --success: #51cf66;
  --border: #242a45;
}

html, body, #__nuxt, .app {
  height: 100%;
}

body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  background: radial-gradient(1200px 600px at 10% -10%, #1b2350, transparent),
    radial-gradient(1000px 500px at 110% -20%, #1a173b, transparent),
    var(--bg);
  color: var(--text);
}

.footer {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  padding: 24px 0 48px;
}

.footer a { color: var(--primary) }
</style>
