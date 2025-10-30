<template>
  <div class="max-w-lg mx-auto p-6">
    <form @submit.prevent="submitForm" class="space-y-4">
      <input
        v-model="formData.name"
        type="text"
        placeholder="Your Name"
        required
        class="w-full p-3 rounded-[4px] bg-white dark:bg-gray-800 border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
      />
      <input
        v-model="formData.email"
        type="email"
        placeholder="Your Email"
        required
        class="w-full p-3 rounded-[4px] bg-white dark:bg-gray-800 border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
      />
      <textarea
        v-model="formData.message"
        placeholder="Your Message"
        required
        class="w-full p-3 rounded-[4px] bg-white dark:bg-gray-800 border-[3px] border-dashed border-[color:var(--divider)] dark:border-[color:var(--divider-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
      ></textarea>
      <UiButton class="w-full" type="submit">Send Message</UiButton>
      <p v-if="message" class="text-m2 mt-2 text-center">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  access_key: '346265d8-f572-44e9-afd5-45bf06487953',
  name: '',
  email: '',
  message: '',
});
const message = ref('');

const submitForm = async () => {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    });
    const result = await response.json();
    if (result.success) {
      message.value = 'Message sent successfully!';
      formData.value.name = '';
      formData.value.email = '';
      formData.value.message = '';
    } else {
      message.value = 'Failed to send message.';
    }
  } catch (error) {
    message.value = 'An error occurred. Please try again later.';
  }
};
</script>
