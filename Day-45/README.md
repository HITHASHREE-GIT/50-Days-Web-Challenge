# Day 45: Advanced Component Composition (Templates & Slots)

## 📝 What I Built
Today I built flexible Web Components using HTML Templates and Slots for advanced component composition.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-45/

## 📸 Screenshots

### 💻 Code View
![Day 45 Code](screenshots/day45-code.png)

### 🌐 Browser Output
![Day 45 Output](screenshots/day45-output.png)

### 🧩 Modal Components
![Modals](screenshots/day45-modals.png)

## 🔑 Key Learnings

### 1. HTML Template
```html
<template id="modal-template">
    <style>/* CSS */</style>
    <div class="modal">
        <slot name="title">Default Title</slot>
        <slot>Default Body</slot>
    </div>
</template>
2. Clone Template into Shadow DOM
javascript

const template = document.getElementById('modal-template');
this.shadowRoot.appendChild(template.content.cloneNode(true));

3. Named and Default Slots
html

<custom-modal>
    <h2 slot="title">Custom Title</h2>
    <p>Custom Body Content</p>
</custom-modal>

4. ::slotted() Selector
css

::slotted([slot="title"]) {
    color: red;
}

🧩 Challenges Faced

Challenge: Template loading order

    Solution: Load components after templates are parsed

Challenge: Styling slotted content

    Solution: Use ::slotted() pseudo-element

🎯 Features Implemented

    ☑

    HTML Template with slots
    ☑

    Named slots
    ☑

    Default slots
    ☑

    Template cloning
    ☑

    Modal with open/close
    ☑

    Card component
    ☑

    ::slotted() styling

🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-45/