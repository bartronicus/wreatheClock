<!-- SUCCESS -->
<template>
  <div class="text-xl text-center font-bold">
    <h1>
    {{
      'Hi ' +
        employee.split(' ')[0] +
        '! You are signed ' +
        (signin ? 'in' : 'out') +
        '!'
    }}
    </h1>
    <h1>Have a great day!</h1>
  </div>
</template>

<script>
export default {
    props: ["employee","signin"]
}
</script>