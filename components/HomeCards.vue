<template>
  <section class="md:min-h-[20vh]" id="contact">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UiCard
          v-for="link in links"
          :key="link.label"
          variant="dashed"
          class="cursor-pointer flex items-center py-6 flex-col max-w-[350px] w-full mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] transition duration-150"
          tabindex="0"
          @click="goTo(link.route)"
          @keydown.enter="goTo(link.route)"
        >
          <div class="icon mb-4">
            <component :is="link.icon" :size="22" :stroke-width="1.6" />
          </div>
          <p class="font-general-semibold text-md sm:text-xl font-semibold p-0">
            {{ link.label }}
            <span v-if="link.external" class="text-sm text-gray-500 ml-2">(External)</span>
          </p>
        </UiCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconTool from '@/components/icons/IconTool.vue'
import IconBook from '@/components/icons/IconBook.vue'
import IconMail from '@/components/icons/IconMail.vue'

const links = [
  { label: "Skills & Solutions", route: "/highlights", icon: IconTool, external: false },
  { label: "Blog & Hub", route: "https://hub.jovylle.com/", icon: IconBook, external: true },
  { label: "Contact Me", route: "/contact", icon: IconMail, external: false },
];

const goTo = (route) => {
  if (route.startsWith("http")) {
    window.open(route, "_blank");
  } else if (route === "#") {
    // Trigger the chatbot toggle if the route is "#"
    const event = new CustomEvent('toggle-chatbot');
    window.dispatchEvent(event);
  } else {
    window.location.href = route;
  }
};
</script>

<style>
/* Card Styles */
/* .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: #2d4dba; 
  Slightly lighter blue for cards
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
  background-color: #365fcf;
   Hover effect
  transform: translateY(-5px);
} */

.icon {
  color: currentColor;
}
</style>