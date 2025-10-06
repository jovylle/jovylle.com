<template>
  <section class="md:min-h-[20vh]" id="contact">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="link in links"
          :key="link.label"
          class="card rounded-xl shadow-lg hover:shadow-xl cursor-pointer dark:border-4 dark:border-m4 flex items-center py-6 flex-col max-w-[350px] w-full mx-auto bg-white dark:bg-ternary-dark"
          @click="goTo(link.route)"
        >
          <div class="icon mb-4">{{ link.icon }}</div>
          <p class="font-general-semibold text-md sm:text-xl font-semibold p-0">
            {{ link.label }}
            <span v-if="link.external" class="text-sm text-gray-500 ml-2">(External)</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const links = [
  { label: "Some of my work", route: "/highlights", icon: "🚀", external: false },
  { label: "Blog & Hub", route: "https://hub.jovylle.com/", icon: "📝", external: true },
  { label: "Contact Me", route: "/contact", icon: "📧", external: false },
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
  font-size: 2.5rem;
  color: white;
}
</style>