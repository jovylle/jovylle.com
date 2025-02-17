<template>
  <div class="chatbot-container rounded-2xl p-4">
    <div class="chatbot-header">
      <h4>AI assistant</h4>
      <button @click="$emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#5f6368"
        >
          <path
            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
          />
        </svg>
      </button>
    </div>
    <div class="chatbot-body">
      <div
        v-for="message in messages"
        :key="message.id"
        class="chatbot-message"
        v-html="message.html"
      ></div>
      <div v-if="loading" class="loading-indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="background: none; display: block; shape-rendering: auto;"
          width="40px"
          height="40px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#5f6368"
            stroke-width="10"
            r="35"
            stroke-dasharray="164.93361431346415 56.97787143782138"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
        </svg>
      </div>
    </div>
    <div class="chatbot-footer justify-between space-x-5">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        class="p-3 rounded-lg bg-ternary-light w-full"
        :disabled="loading"
      />
      <button class="p-3" @click="sendMessage" :disabled="loading">Send</button>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  props: {
    skills: Array,
    projects: Array
  },
  data() {
    return {
      userInput: '',
      messages: [],
      loading: false
    };
  },
  methods: {
    async sendMessage() {
      const userMessage = this.userInput;
      this.messages.push({ id: Date.now(), text: userMessage, html: marked(userMessage) });
      this.userInput = '';
      this.loading = true;

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: userMessage,
            skills: this.skills,
            projects: this.projects
          })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content.trim();
        this.messages.push({ id: Date.now() + 1, text: aiMessage, html: marked(aiMessage) });
      } catch (error) {
        console.error('Error fetching AI response:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  width: 40vw;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
}
.chatbot-body {
  max-height: 400px;
  overflow-y: auto;
}
.chatbot-footer {
  display: flex;
  padding: 10px;
}
.chatbot-message {
  margin-bottom: 10px;
  padding: 0px 10px;
}
:nth-child(odd).chatbot-message {
  text-align: right;
}
.chatbot-message:nth-child(even) {
  @apply bg-primary-light p-5 rounded-lg;
}
.loading-indicator {
  margin-bottom: 10px;
  padding: 0px 10px;
  @apply bg-primary-light p-5 rounded-lg;
}
</style>
