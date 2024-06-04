<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { useAuthStore } from "../stores/sec-auth.store";

const authStore = useAuthStore();

function getUsers() {
  authStore.allUsers()
}
function logOut() {
  authStore.logout()
}

</script>

<template>
  <main>
    <button @click="getUsers">Get Users</button>
    <button @click="logOut">Logout</button>
    <TheWelcome />
  </main>
</template>
