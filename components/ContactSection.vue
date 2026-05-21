<template>
  <section class="md:min-h-[40vh] flex_center" id="contact">
    <div class="container">
      <h2
        class="text-3xl sm:text-5xl text-center font-semibold my-8 my_hover"
      >
        Contact me / Socials
      </h2>
      
      <ContactForm />
      <p class="text-center text-lg mt-6">
        Or email me directly at <a class="underline font-medium" href="mailto:me@jovylle.com">me@jovylle.com</a>
      </p>
      <div
        class="flex justify-center space-x-6 my-8 items-center text-4xl text-m1"
      >
        <a aria-label="mail me" href="mailto:me@jovylle.com">
          <i class="my_hover bx bxl-gmail text-m4 dark:text-primary-light"></i>
        </a>
        <a aria-label="github link" href="https://github.com/jovylle">
          <i class="my_hover bx bxl-github text-m4 dark:text-primary-light"></i>
        </a>
        <!-- <a href="">
            <i class='my_hover bx bxl-dev-to'></i>
          </a> -->
        <a
          aria-label="linkedin link"
          href="https://www.linkedin.com/in/jovylle/"
        >
          <i class="my_hover bx bxl-linkedin text-m4 dark:text-primary-light"></i>
        </a>
      </div>
    </div>
  </section>
</template>
