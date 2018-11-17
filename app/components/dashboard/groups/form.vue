<template>
  <form class="not-so-large" @submit.prevent="submit">
    <label :for="_uid + '-form-group-name'">Group name</label>
    <input
      :id="_uid + '-form-group-name'"
      v-model="groupName"
      :disabled="!edition"
      type="text"
      placeholder="Group name"
    >

    <footer v-show="edition">
      <button
        v-show="groupSlug"
        type="button"
        class="btn btn-link"
        @click.prevent="close"
      >
        <template>Cancel</template>
      </button>
      <button type="submit" class="btn">{{ groupSlug ? 'Save' : 'Create' }}</button>
    </footer>
  </form>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')

module.exports = {
  name: 'common-group-form',

  props: {
    groupSlug: {
      type: String,
      default: null
    },
    edition: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      groupName: ''
    }
  },

  computed: {
    ...mapGetters([
      'getGroup'
    ]),
    group () {
      return this.getGroup(this.groupSlug)
    }
  },

  watch: {
    group: {
      handler: 'reset',
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'groupCreate',
      'groupUpdate'
    ]),

    reset () {
      if (this.group) {
        this.groupName = this.group.name
      }
    },

    async submit () {
      let ret

      if (this.groupSlug) {
        ret = await this.groupUpdate({ groupSlug: this.groupSlug, name: this.groupName })
      } else {
        ret = await this.groupCreate({ name: this.groupName })
      }

      this.close(ret || null)
    },

    close (status = null) {
      this.$emit('close', status)
      this.reset()
    }
  }
}
</script>
