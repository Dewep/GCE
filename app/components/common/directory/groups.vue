<template>
  <form class="not-so-large" @submit.prevent="submit">
    <div :class="{ 'links-checkbox': edition }" class="links-list">
      <div
        v-for="group in groups"
        v-show="edition || directory.groups.includes(group.slug)"
        :key="group.slug"
        class="flex-row"
      >
        <router-link
          :to="{ name: 'dashboard-group', params: { groupSlug: group.slug } }"
          :class="{ active: edition && formGroups.includes(group.slug) }"
          :event="edition ? '' : 'click'"
          class="flex-extensible-fixed"
          @click.native="toggleGroup($event, group.slug)"
        >
          <template>{{ group.name }}</template>
        </router-link>
      </div>
    </div>

    <footer v-show="edition">
      <button
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button type="submit" class="btn">Save</button>
    </footer>
  </form>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')

module.exports = {
  name: 'common-directory-form',

  props: {
    projectSlug: {
      type: String,
      required: true
    },
    directorySlug: {
      type: String,
      required: true
    },
    edition: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      formGroups: []
    }
  },

  computed: {
    ...mapGetters([
      'getDirectory',
      'groups'
    ]),
    directory () {
      return this.getDirectory(this.directorySlug)
    }
  },

  watch: {
    directory: {
      handler: 'reset',
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'directoryUpdate'
    ]),
    reset () {
      if (this.directory) {
        this.formGroups = [...this.directory.groups]
      }
    },
    toggleGroup (event, groupSlug) {
      if (this.edition) {
        if (this.formGroups.includes(groupSlug)) {
          this.formGroups = this.formGroups.filter(g => g !== groupSlug)
        } else {
          this.formGroups.push(groupSlug)
        }
      }
    },
    submit () {
      this.directoryUpdate({
        directorySlug: this.directorySlug,
        groups: this.formGroups
      })

      this.close(true)
    },
    close (status = false) {
      this.$emit('close', status)
      this.reset()
    }
  }
}
</script>
