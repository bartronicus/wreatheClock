<template>
  <div
    class="flex w-full absolute text-gray-800 pt-4 m-auto pt-32 flex-col justify-center items-center"
  >
    <form
      class="w-full max-w-sm mx-auto border-b-2 border-gray-400 mb-12 focus-within:border-teal-500"
    >
      <div class="flex items-center">
        <input
          type="text"
          aria-label="Full name"
          v-model="employeeFilter"
          list="employeesDL"
          class="appearance-none h-6 bg-transparent border-none w-full text-gray-700 mr-3 py-6 px-2 leading-tight focus:outline-none"
          placeholder="Please Select a Name"
          name="employeesDL"
          spellcheck="false"
        />

        <transition name="fade">
          <button
            @click="employeeFilter = ''"
            v-if="employeeFilter"
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

    <datalist id="employeesDL">
      <option v-for="e in employees" :value="e.name" :key="e.name">{{
        e.name
      }}</option>
      <option value="Jordan Barton">Jordan Barton</option>
    </datalist>

    <div>
      <table v-if="totals.length">
        <thead>
          <th align="left" class="px-2 pb-2">Employee</th>
          <th align="left" class="px-2 pb-2">Hours</th>
        </thead>
        <tbody>
          <tr
            @click="setActive(e)"
            v-for="e in totals"
            :key="e.name"
            class="py-1"
          >
            <td class="py-2 px-2 pr-32">{{ e.name }}</td>
            <td class="py-2 px-2">
              {{ (e.hours.total / 1000 / 60 / 60).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>

      <table class="pt-4" v-if="active || viewHours">
        <thead>
          <th align="left" class="px-2">In</th>
          <th align="left" class="px-2">Out</th>
          <th align="left" class="px-2">Length</th>
        </thead>
        <tbody v-if="viewHours">
          <tr v-for="set in viewHours.hours.intervals" :key="set.in">
            <td class="py-2 px-2">{{ formatDate(set.in) }}</td>
            <td class="py-2 px-2">{{ formatDate(set.out) }}</td>
            <td class="py-2 px-2">{{ set.session }}</td>
          </tr>
        </tbody>
        <tbody v-if="active">
          <tr v-for="set in active.hours.intervals" :key="set.in">
            <td class="py-2 px-2">{{ formatDate(set.in) }}</td>
            <td class="py-2 px-2">{{ formatDate(set.out) }}</td>
            <td class="py-2 px-2">{{ set.session }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: '',
      employeeFilter: '',
      employees: []
    }
  },
  watch: {
    employeeFilter: function() {
      this.active = ''
    }
  },
  props: ['log'],
  computed: {
    viewHours() {
      if (this.totals.length === 1)
        return this.employees.filter(e => e.name === this.employeeFilter)[0]
    },
    totals() {
      if (!this.employeeFilter) return []
      let users = []
      this.log.forEach(l => !users.includes(l[0]) && users.push(l[0]))
      users = users.map(u => {
        return {
          name: u,
          hours: this.createTotal(u)
        }
      })
      this.employees = users
      if (this.employeeFilter && this.employeeFilter !== 'Jordan Barton')
        return users.filter(u => u.name === this.employeeFilter)
      if (this.active) return users.filter(u => u.name === this.active.name)
      return users
    }
  },
  methods: {
    formatDate(d) {
      var dv = new Date(parseInt(d));
      const fd = dv.toLocaleDateString('en-us', {
        dateStyle: "short",
        timeStyle: 'short',
      })
      return fd
    },
    setActive(e) {
      if (this.employeeFilter !== 'Jordan Barton') return
      this.active.name === e.name ? (this.active = '') : (this.active = e)
    },
    createTotal(user) {
      const hours = this.log.filter(u => u[0] === user)
      let sets = []
      let active = false
      hours.forEach((h, i) => {
        if (h[1] === 'in') sets.push({ in: h[2] })
        if (h[1] === 'out') {
          sets[sets.length - 1].out = h[2]
          sets[sets.length - 1].session = h[2] - sets[sets.length - 1].in
        }
        if (i === hours.length - 1) {
          const lastValue = sets[sets.length - 1]
          if (!lastValue.out) {
            sets[sets.length - 1].out = Date.now()
            sets[sets.length - 1].session =
              sets[sets.length - 1].out - sets[sets.length - 1].in
          }
        }
      })
      return {
        active: active,
        intervals: sets,
        total: sets.reduce((acc, cur) => {
          return acc.session || 0 + cur.session || 0
        }, 0)
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
