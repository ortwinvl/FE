<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "../stores/sec-auth.store";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();

const form = ref({
  email: "",
  password: "",
  remember: false,
});

async function onSubmit() {
  await authStore.login(form.value.email, form.value.password);
}

async function onForgetPWd() {
  console.log("Forget password");
}

</script>

<template>
  <!-- BEGIN login -->
  <div class="login">
    <!-- BEGIN login-content -->
    <div class="login-content">
      <form method="POST" name="login_form" @submit.prevent="onSubmit">
        <br />
        <h1 class="text-center text-primary">Sign In</h1>
        <div class="text-inverse text-opacity-50 text-center mb-4">
          For your protection, please verify your identity.
        </div>
        <div class="mb-3">
          <label class="form-label"
            >Email Address <span class="text-danger">*</span></label
          >
          <input
            v-model="form.email"
            type="text"
            class="form-control form-control-lg bg-white bg-opacity-5"
            value=""
            placeholder="user@email.com"
            data-testid="email"
          />
        </div>
        <div class="mb-3">
          <div class="d-flex">
            <label class="form-label"
              >Password <span class="text-danger">*</span></label
            >
            <a
              href="#"
              class="ms-auto text-inverse text-decoration-none text-opacity-50"
              @click="onForgetPWd"
              data-testid="forgetpwd"
              >Forgot password?</a
            >
          </div>
          <input
            v-model="form.password"
            type="password"
            class="form-control form-control-lg bg-white bg-opacity-5"
            value=""
            placeholder=""
            data-testid="password"
          />
        </div>
        <button
          type="submit"
          data-testid="submit"
          class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3"
        >
          Sign In
        </button>
      </form>
    </div>
    <!-- END login-content -->
  </div>
  <!-- END login -->
</template>
