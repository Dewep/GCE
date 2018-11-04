<template>
  <div class="links-list not-so-large">
    <div
      v-for="(project, $index) in projects"
      :key="project.slug"
      class="flex-row"
    >
      <router-link
        :to="{ name: 'project', params: { projectSlug: project.slug } }"
        :event="selection ? '' : 'click'"
        class="flex-extensible-fixed"
        active-class="no-active"
        @click.native="selectProject(project.slug)"
      >
        <template>{{ project.name }}</template>
      </router-link>

      <a
        v-show="!selection"
        :class="{ disabled: $index === 0 }"
        class="flex-fixed code"
        @click.prevent="projectPositionUp({ projectSlug: project.slug })"
      >
        <template>▲</template>
      </a>

      <a
        v-show="!selection"
        :class="{ disabled: $index === projects.length - 1 }"
        class="flex-fixed code"
        @click.prevent="projectPositionDown({ projectSlug: project.slug })"
      >
        <template>▼</template>
      </a>
    </div>

    <div class="flex-row">
      <a class="flex-extensible-fixed mt-10 p-8" @click="newProject = true">Add a new project</a>
    </div>

    <modal v-if="newProject" :active.sync="newProject" title="Project creation">
      <common-project-form
        @close="selectProject($event)"
      />
    </modal>
  </div>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const Modal = require('../modal.vue')
const CommonProjectForm = require('./form.vue')

module.exports = {
  name: 'common-project-list',

  props: {
    selection: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Modal,
    CommonProjectForm
  },

  data () {
    return {
      newProject: false
    }
  },

  computed: {
    ...mapGetters([
      'projects'
    ])
  },

  methods: {
    ...mapActions([
      'projectPositionUp',
      'projectPositionDown'
    ]),

    selectProject (projectSlug) {
      this.newProject = false

      if (projectSlug) {
        this.$emit('selection', projectSlug)
      }
    },

    close (status = false) {
      this.$emit('close', status)
    }
  }
}
</script>
