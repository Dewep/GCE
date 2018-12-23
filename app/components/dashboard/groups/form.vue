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

    <label>Global group</label>
    <button
      :disabled="!edition"
      type="button"
      class="btn btn-link"
      @click.prevent="groupGlobal = !groupGlobal"
    >
      <template>{{ groupGlobal ? 'Yes' : 'No' }}</template>
    </button>
    <blockquote v-show="edition">If yes, the commands of this group will be linked to all your directories.</blockquote>

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
      groupName: '',
      groupGlobal: false
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
        this.groupGlobal = this.group.global || false
      }
    },

    async submit () {
      let ret

      if (this.groupSlug) {
        ret = await this.groupUpdate({ groupSlug: this.groupSlug, name: this.groupName, global: this.groupGlobal })
      } else {
        ret = await this.groupCreate({ name: this.groupName, global: this.groupGlobal })
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
