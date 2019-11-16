<template>
  <div class="min-h-screen relative flex m-auto  justify-center items-center">

    <Spinner v-if="loading && !success" />

    <div v-if="!authenticated" class="absolute w-full h-full inset-0 flex justify-center items-center" style="background:rgba(300,300,300,.95)" >
      <div class="rounded py-2 cursor-pointer border border-purple-300 px-4 bg-white opacity-100 shadow-md rounded text-md hover:shadow-lg" @click="authenticate">
        Sign In!
      </div>
    </div>

    <div v-if="!loading && !success" class="m-auto flex flex-col text-center h-64 p-5 w-full max-w-xl" >

      <select v-model="employee" class="p-4 block mb-8 w-full bg-purple-400 text-gray-100 text-lg font-bold max-w-md" >
        <option class="p-4" value="">Please Select our Name</option>
        <option class="p-4" v-for="e in employees" :key="e" :value="e">{{e}}</option>
      </select>

      <div v-if="employee" class="py-4 w-full max-w-md font-bold cursor-pointer select-none rounded border border-purple-300" @click="update" :class="[employee ? 'bg-purple-400 text-white' : 'bg-gray-100 text-gray-500' ]">
        {{ signin ? "Sign In!" : "Sign Out!" }}
      </div>
      <p v-if="error" class="font-bold text-red-400">{{ error }}</p>
    </div> 
    <Success :employee="employee" :signin="signin" v-if="!loading && success" />   
  </div>
</template>

<script src="./logic.js"></script>

