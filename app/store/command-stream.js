import { ref } from 'vue'

class CommandStreamStore {
  constructor () {
    this.slug = ref(null)
    this.projectSlug = ref(null)
    this.directorySlug = ref(null)
    this.name = ref(null)
    this.args = ref(null)
    this.cwd = ref(null)
    this.creationDate = ref(null)
    this.runningDate = ref(null)
    this.stoppedDate = ref(null)
    this.output = ref([])
  }

  update ({ slug, projectSlug, directorySlug, name, args, cwd, creationDate, runningDate, stoppedDate }) {
    this.slug.value = slug
    this.projectSlug.value = projectSlug
    this.directorySlug.value = directorySlug
    this.name.value = name
    this.args.value = args
    this.cwd.value = cwd
    this.creationDate.value = creationDate
    this.runningDate.value = runningDate
    this.stoppedDate.value = stoppedDate
  }

  addOutput (outputs) {
    for (const output of outputs) {
      this.output.push(output)
    }
    // TODO: remove old output
  }
}

export default CommandStreamStore
