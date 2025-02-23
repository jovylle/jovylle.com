<template>
  <div class="max-w-lg mx-auto p-6">
    <form @submit.prevent="submitForm" class="space-y-4">
      <input
        v-model="formData.name"
        type="text"
        placeholder="Your Name"
        required
        class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
      />
      <input
        v-model="formData.email"
        type="email"
        placeholder="Your Email"
        required
        class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
      />
      <textarea
        v-model="formData.message"
        placeholder="Your Message"
        required
        class="w-full p-3 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
      ></textarea>
      <button
        type="submit"
        class="w-full bg-m4 hover:bg-m3 text-white font-semibold p-3 rounded-lg"
      >
        Send Message
      </button>
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
