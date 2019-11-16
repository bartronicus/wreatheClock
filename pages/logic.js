import Spinner from '~/components/Spinner.vue'
import Success from '~/components/Success.vue'
import dataModel from './dataModel.js'

export default {
  components: {
    Spinner,
    Success
  },
  data() {
    return dataModel
  },
  computed: {
    signin() {
      if (!this.employee) return false
      const count = this.log.filter(e => e[0] === this.employee).length
      if (!count || !(count % 2)) return true
      return false
    }
  },
  created: function() {
    gapi.load('client:auth2', this.initClient)
  },
  mounted: function() {
    // this.getLog();
  },
  methods: {
    async getLog() {
      let log = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.googs.spreadsheet,
        range: 'hours!A2:A'
      })
      this.log = log.result.values
    },
    authenticate() {
      gapi.auth2.getAuthInstance().signIn()
    },
    async getemployees() {
      const ssData = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.googs.spreadsheet,
        range: 'workers!A2:A'
      })

      this.employees = ssData.result.values.map(cell => cell[0])
    },
    initClient() {
      gapi.client
        .init({
          apiKey: this.googs.API_KEY,
          clientId: this.googs.CLIENT_ID,
          discoveryDocs: this.googs.DISCOVERY_DOCS,
          scope: this.googs.SCOPES
        })
        .then(
          () => {
            gapi.auth2.getAuthInstance().isSignedIn.listen()
            const isAuthenticated = gapi.auth2
              .getAuthInstance()
              .isSignedIn.get()
            this.authenticated = isAuthenticated
            this.getemployees()
            this.getLog()
          },
          error => {
            alert(error)
          }
        )
    },
    async update() {
      if (!this.employee) return (this.error = 'Please select your name!')
      this.error = ''
      this.loading = true
      const inputRow = this.log.length + 2
      const values = [[this.employee, this.signin ? 'in' : 'out', Date.now()]]
      const params = {
        spreadsheetId: this.googs.spreadsheet,
        range: `A${inputRow}:C${inputRow}`,
        valueInputOption: 'RAW',
        includeValuesInResponse: false,
        resource: { values }
      }
      await gapi.client.sheets.spreadsheets.values.update(params, values)
      this.loading = false
      this.success = true
      this.error = ''
      setTimeout(() => {
        this.getLog()
        this.success = false
        this.employee = ''
      }, 4000)
    }
  }
}
