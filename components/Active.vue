<template>
  <div class="flex flex-col items-center pt-32 justify-center">
    <p class="text-lg pb-2 font-semibold">Active Employees</p>
    <p class="py-2" v-for="u in users"  :key="u.name">{{u}}</p>
  </div>
</template>

<script>
export default {
    props: ['log'],
    computed: {
      users () {      
        let users = this.log.map(l => {
          return {
            name: l[0],
            logs: this.log.filter(ll => ll[0] === l[0]).length
          }
        })
        
        users = users.filter(u => u.logs % 2 !== 0);
        const unique = [];
        users.forEach(u => {          
          !unique.includes(u.name) && unique.push(u.name)
        });
        return unique;
      }
    }
}
</script>