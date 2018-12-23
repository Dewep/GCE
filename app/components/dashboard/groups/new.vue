<template>
  <div class="main-content">
    <h4>Groups list</h4>

    <div class="links-list not-so-large">
      <div
        v-for="group in groups"
        :key="group.slug"
        class="flex-row"
      >
        <router-link
          :to="{ name: 'dashboard-group', params: { groupSlug: group.slug } }"
          class="flex-extensible-fixed"
        >
          <template>{{ group.name }}</template>
        </router-link>
      </div>
    </div>

    <h4>New group</h4>

    <common-group-form
      @close="redirectToGroup"
    />

    <h4>Import from URL</h4>
    <p v-if="importError" class="toast-error mb-4">{{ importError }}</p>
    <form
      v-if="importList.length"
      :class="{ 'loading-lg': importLoading }"
      class="not-so-large"
      @submit.prevent="importGroups"
    >
      <p class="mb-4">Select the groups to import:</p>

      <div class="links-list links-checkbox">
        <div
          v-for="(group, $index) in importList"
          :key="$index"
          class="flex-row"
        >
          <a
            :class="{ active: group.enabled }"
            class="flex-extensible-fixed"
            @click="group.enabled = !group.enabled"
          >
            <template>{{ group.name }}</template>
          </a>
        </div>
      </div>

      <footer>
        <button
          type="button"
          class="btn btn-link"
          @click.prevent="cancelImportGroups"
        >
          <template>Cancel</template>
        </button>
        <button type="submit" class="btn">Import</button>
      </footer>
    </form>
    <form
      v-else
      :class="{ 'loading-lg': importLoading }"
      class="not-so-large"
      @submit.prevent="loadImportUrl"
    >
      <p>Import definition from a JSON URL to automatically setup some groups.</p>

      <label :for="_uid + '-form-groups-url'">JSON Groups URL</label>
      <input
        :id="_uid + '-form-groups-url'"
        v-model="importUrl"
        type="text"
        placeholder="https://www.example.com/gce/groups.json"
      >

      <footer>
        <button type="submit" class="btn">Load</button>
      </footer>
    </form>
  </div>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const CommonGroupForm = require('./form.vue')

module.exports = {
  name: 'dashboard-groups-new',

  data () {
    return {
      importLoading: false,
      importError: null,
      importUrl: '',
      importList: []
    }
  },

  components: {
    CommonGroupForm
  },

  computed: {
    ...mapGetters([
      'groups'
    ])
  },

  methods: {
    ...mapActions([
      'groupsImport'
    ]),

    redirectToGroup (groupSlug) {
      this.$router.push({ name: 'dashboard-group', params: { groupSlug } })
    },

    async loadImportUrl () {
      if (this.importLoading) {
        return
      }
      this.importLoading = true
      this.importError = null
      this.importList = []

      try {
        const response = await fetch(this.importUrl)
        const json = await response.json()

        for (const group of (json.groups || [])) {
          if (!group.slug || !group.name || !group.commands) {
            continue
          }
          group.commands = group.commands.filter(command => command && command.name && command.args && command.args.length)
          if (!group.commands.length) {
            continue
          }
          this.importList.push({
            name: `Group "${group.name}"`,
            enabled: false,
            group
          })
        }

        if (!this.importList.length) {
          throw new Error('No groups found in this package')
        }
      } catch (err) {
        console.warn('[loadImportUrl]', err)
        this.importError = err.message
      }

      this.importLoading = false
    },

    async importGroups () {
      if (this.importLoading) {
        return
      }
      this.importError = null
      this.importLoading = true

      try {
        const groups = this.importList.filter(p => p.enabled && p.group).map(p => p.group)

        if (groups.length) {
          await this.groupsImport({ groups })
        }

        this.importLoading = false
        this.cancelImportGroups()
      } catch (err) {
        console.warn('[importGroups]', err)
        this.importError = err.message
      }

      this.importLoading = false
    },

    cancelImportGroups () {
      if (this.importLoading) {
        return
      }
      this.importList = []
      this.importError = null
      this.importUrl = ''
    }
  }
}
</script>
