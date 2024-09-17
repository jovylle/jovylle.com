
<template>
  <div class="container mx-auto py-10 sm:py-20">
    <ContentDoc :path="`/decap/posts/blog/2024-09-17-title`">
      <template #not-found>
        <div class="min-h-[40vh] flex flex-col justify-center items-center">
          <h2 class="block">404 Page Not Found.</h2>
          <NuxtLink class="" to="/">
            <button class="underline underline-offset-8">
              Go back home. cd ~
            </button>
          </NuxtLink>
        </div>
      </template>
    </ContentDoc>
  </div>
</template>
