<template>
  <div class="main-content">
    <div class="links-list not-so-large">
      <div class="flex-row">
        <router-link
          :to="{ name: 'dashboard-group-new' }"
          exact
          class="flex-extensible-fixed p-3"
        >
          <small>Return to groups list</small>
        </router-link>
      </div>
    </div>

    <h4>
      <button v-show="!form" class="btn" @click="form = 'update'">Update</button>
      <button v-show="!form" class="btn btn-error" @click="form = 'delete'">Remove</button>
      <template>Group definition</template>
    </h4>
    <form v-if="form === 'delete'" class="not-so-large" @submit.prevent="removeGroup">
      <p>All the directory present to this group will be unlinked, and all the commands of this group will be removed.</p>
      <footer>
        <button class="btn btn-link" @click.prevent="form = null">Cancel</button>
        <button class="btn btn-error" type="submit">Remove</button>
      </footer>
    </form>
    <common-group-form
      v-else
      :group-slug="groupSlug"
      :edition="form === 'update'"
      @close="form = null"
    />

    <h4>Group commands</h4>
    <div class="commands-list">
      <commands-list-item
        v-for="commandSlug in group.commands"
        :key="commandSlug"
        :command-slug="commandSlug"
        :group-slug="groupSlug"
        :run-as-edition="true"
        :display-group="false"
      />
    </div>

    <div class="commands-list mb-20">
      <div class="commands-list-item commands-list-item-extra">
        <div class="main">
          <a class="description" @click.prevent="newCommandModal = true">
            <h5>+ Add a new command...</h5>
          </a>

          <modal :active.sync="newCommandModal" :title="`New command for ${group.name}`">
            <common-command-form
              :group-slug="groupSlug"
              @close="newCommandModal = false"
            />
          </modal>
        </div>
      </div>
    </div>

    <h4>
      <button v-show="!updateDirectories" class="btn" @click="updateDirectories = true">Update</button>
      <template>Group directories</template>
    </h4>
    <p>...</p>
    <!-- <p v-if="!updateDirectories && !directory.groups.length"><i>No group linked to this directory.</i></p> -->
    <!-- <common-directory-groups
      v-else
      :project-slug="projectSlug"
      :directory-slug="directorySlug"
      :edition="updateDirectories"
      @close="updateDirectories = false"
    /> -->
  </div>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const CommandsListItem = require('../../common/commands-list-item.vue')
const CommonCommandForm = require('../../common/command/form.vue')
const Modal = require('../../common/modal.vue')
const CommonGroupForm = require('./form.vue')

module.exports = {
  name: 'dashboard-group',

  props: {
    groupSlug: {
      type: String,
      required: true
    }
  },

  components: {
    CommandsListItem,
    Modal,
    CommonGroupForm,
    CommonCommandForm
  },

  data () {
    return {
      form: null,
      newCommandModal: false,
      updateDirectories: false
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
      handler () {
        if (!this.group) {
          this.$router.push({ name: 'dashboard-group-new' })
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'groupRemove'
    ]),

    removeGroup () {
      this.groupRemove({ groupSlug: this.groupSlug })
    }
  }
}
</script>
