<template>
  <div>
    <Nav v-if="authenticated" @nav="setNav" :active="activeTab" />
    <Hours v-if="activeTab === 'hours'" :log="log" />
    <Active v-if="activeTab === 'active'" :log="log" />
    <div
      v-if="activeTab === 'clock'"
      class="min-h-screen relative pt-32 m-auto"
    >
      <Spinner v-if="loading && !success" />

      <div
        v-if="!authenticated"
        class="absolute w-full h-full inset-0 flex justify-center items-center"
        style="background:rgba(300,300,300,.95)"
      >
        <div
          class="rounded py-2 cursor-pointer border border-purple-300 px-8 bg-white opacity-100 shadow-md rounded text-md hover:shadow-lg"
          @click="authenticate"
        >
          Sign In!
        </div>
      </div>

      <div
        v-if="!loading && !success"
        class="test m-auto flex items-center flex-col"
      >

    <form
      class="w-full max-w-sm mx-auto border-b-2 border-gray-400 mb-12 focus-within:border-teal-500"
    >
      <div class="flex items-center">
        <input
          type="text"
          aria-label="Full name"
          v-model="employee"
          list="employeesDL"
          class="appearance-none h-6 bg-transparent border-none w-full text-gray-700 mr-3 py-6 px-2 leading-tight focus:outline-none"          
          placeholder="Please Enter a Name"
          name="employeesDL"
          spellcheck="false"
        />

        <transition name="fade">
          <button
            @click="employee = ''"
            v-if="employee"
            class="mb-2 focus-within:shadow-outline focus:outline-none flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
          >
            <svg class="h-4 w-4" id="times" viewBox="0 0 352 512">
              <path
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path>
            </svg>
          </button>
        </transition>
      </div>
    </form>



        <!-- <input
          v-model="employee"
          list="employeesDL"
          class="w-64 border border-purple-400 rounded px-2 focus:border-2 focus:border-pink-400 mb-8 outline-none"
          placeholder="Please Select Your Name"
          name="employeesDL"
          type="text"
          spellcheck="false"
        /> -->

        <datalist id="employeesDL">
          <option v-for="e in employees" :value="e" :key="e">{{ e }}</option>
        </datalist>

        <transition name="fade">
          <div
            v-if="selectionMade"
            class="text-center w-32 py-2 mt-12 bg-teal-500 text-white font-bold cursor-pointer select-none rounded border"
            @click="update"            
          >
            {{ signin ? 'Sign In!' : 'Sign Out!' }}
          </div>
        </transition>

        <p v-if="error" class="font-bold text-red-400">{{ error }}</p>
      </div>

      <Success
        :employee="employee"
        :signin="signin"
        v-if="!loading && success"
      />
    </div>
  </div>
</template>

<script src="./logic.js"></script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
