<script setup lang="ts">
import { ref } from 'vue'
const text1 = ref('')
const text2 = ref('')
const text3 = ref('')
const text4 = ref('')
const firstName = ref('Tyler')
const lastName = ref('Durden')

fetch('/api/test1/1').then(r => r.text().then(t => text1.value = t))
fetch('/config.json').then(r => r.json().then(t => text4.value = t))

const t2 = ref('myValue')
function sendRequest2 () {
  fetch('/api/test1/users/' + t2.value).then(r => r.json().then(t => text2.value = t))
}

function sendRequest3 () {
  fetch('/api/test1/body/json', {method: 'POST', body: JSON.stringify({'firstName': firstName.value, 'lastName': lastName.value})}).then(r => r.json().then(t => text3.value = t))
}

sendRequest2()
sendRequest3()
</script>

<template>
  <div id="example-app">
    <h3>Example 2 for vite-plugin-mock-simple</h3>
    <div>
      <h6>Mock example 1 🤞</h6>
      <p>Response for <pre>[GET]/api/test1/1</pre></p>
      <div class="response">
        {{ text1 }}
      </div>
    </div>
    
    <div>
      <h6>Mock example 2 🤞</h6>
      <p>Request</p>
      <p class="request">
        <input type="text" v-model="t2" @keyup="sendRequest2()" minlength="1"/>
        <button @click="sendRequest2">Send</button>
      </p>
      <p>Response for <pre>[GET]/api/test1/users/{{t2}}</pre></p>
      <div class="response">{{ JSON.stringify( text2 , null, "\t") }}</div>
    </div>

    <div>
      <h6>Mock example  3 🤞</h6>
      <p>Request</p>
      <p class="request">
        <label>
          First name:
          <input type="text" v-model="firstName"/>
        </label>
        <label>
          Last name:
          <input type="text" v-model="lastName"/>
        </label>
        <button @click="sendRequest3" class="send-button">Send</button>
      </p>
      <p>Response for <pre>[POST]/api/test1/body/json</pre></p>
      <div class="response">{{ JSON.stringify( text3 , null, "\t") }}</div>
    </div>

    <div>
      <h6>Mock example 4 🤞</h6>
      <p>Response for <pre>[GET]/config.json</pre></p>
      <div class="response">{{ JSON.stringify( text4 , null, "\t") }}</div>
    </div>

  </div>
</template>

<style>
.request {
  border-left: 3px solid blue;
  padding-left: 5px;
  display: inline-flex;
}
.request > * {
    margin-right: 1rem;
}
.response {
  white-space: pre;
  border-left: 3px solid green;
  padding-left: 5px;
}
label {
  display: block;
  padding: .5rem 0;
}
#example-app {
  max-width: 900px;
  padding: 1rem;
  margin: 0 auto;
}
h6 {
  margin-top: 1rem;
}
:root{
  --line-height: 1.1;
  --font-size: 18px;
  --typography-spacing-vertical: 1rem;
}
.send-button {
  height: 2.75rem;
  width: 7rem;
  margin-top: 1.75em;
}
input, button{
  margin-bottom: 0 !important;
}
</style>
