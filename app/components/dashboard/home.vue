<template>
  <div class="flex-extensible">
    <div class="main-content">
      <h4>Home</h4>

      <button class="btn" @click="resetData()">Reset data</button>
      <button class="btn" @click="resetExampleData()">Reset example data</button>

      <h4>Projects</h4>
      <div class="links-list not-so-large">
        <div
          v-for="(project, $index) in projects"
          :key="project.slug"
          class="flex-row"
        >
          <router-link
            :to="{ name: 'project', params: { projectSlug: project.slug } }"
            class="flex-extensible-fixed"
          >
            <template>{{ project.name }}</template>
          </router-link>
          <a
            :class="{ disabled: $index === 0 }"
            class="flex-fixed code"
            @click.prevent="projectPositionUp({ projectSlug: project.slug })"
          >
            <template>▲</template>
          </a>
          <a
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
            @close="newProject = false"
          />
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
const { mapGetters, mapActions } = require('vuex')
const Modal = require('../common/modal.vue')
const CommonProjectForm = require('../common/project/form.vue')

module.exports = {
  name: 'dashboard-home',

  components: { Modal, CommonProjectForm },

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
      'projectPositionDown',
      'resetData',
      'resetExampleData'
    ])
  }
}
</script>
